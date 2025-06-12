"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Local.module.css";

interface Paper {
  name: string;
  author: string;
  time: number;
  id: number;
  x: number;
  y: number;
}

export default function Local() {
  const [data, setData] = useState<Paper[]>([]);
  const [hoveredBubble, setHoveredBubble] = useState<number | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [connectedMap, setConnectedMap] = useState<Record<number, Map<number, { dx: number; dy: number }>>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const lastMousePos = useRef<{ x: number; y: number } | null>(null);

  // 获取随机初始位置并设置数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/choopy/Papers.json");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();

        const containerWidth =
          containerRef.current?.offsetWidth || window.innerWidth * 0.9;
        const containerHeight =
          containerRef.current?.offsetHeight || window.innerHeight * 0.85;
        const bubbleSize = 60;

        const papersWithIds = json.map((paper: Paper, index: number) => ({
          ...paper,
          id: index,
          x: Math.random() * (containerWidth - bubbleSize),
          y: Math.random() * (containerHeight - bubbleSize),
        }));

        setData(papersWithIds);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // 鼠标按下开始拖动
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, id: number) => {
    if ("preventDefault" in e) e.preventDefault();

    setDraggedId(id);
    const paper = data.find((p) => p.id === id);
    if (paper) {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      lastMousePos.current = { x: clientX, y: clientY };
    }
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (draggedId === null || !lastMousePos.current) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const dxTotal = clientX - lastMousePos.current.x;
    const dyTotal = clientY - lastMousePos.current.y;

    setData((prev) => {
      const draggedPaper = prev.find((p) => p.id === draggedId);
      if (!draggedPaper) return prev;

      let updated = [...prev];

      // 更新主泡泡位置
      const draggedIndex = updated.findIndex((p) => p.id === draggedId);
      if (draggedIndex !== -1) {
        updated[draggedIndex] = {
          ...updated[draggedIndex],
          x: updated[draggedIndex].x + dxTotal,
          y: updated[draggedIndex].y + dyTotal,
        };
      }

      // 更新所有连接泡泡的位置（递归更新）
      const visited = new Set<number>();
      const queue = [draggedId];

      while (queue.length > 0) {
        const currentId = queue.shift()!;
        const current = updated.find((p) => p.id === currentId);
        if (!current) continue;
        const connections = connectedMap[currentId];
        if (!connections) continue;

        connections.forEach(({ dx, dy }, targetId) => {
          if (visited.has(targetId)) return;
          const target = updated.find((p) => p.id === targetId);
          if (!target) return;

          updated = updated.map((p) =>
            p.id === targetId
              ? {
                  ...p,
                  x: current.x + dx,
                  y: current.y + dy,
                }
              : p
          );

          visited.add(currentId);
          visited.add(targetId);
          queue.push(targetId);
        });
      }

      lastMousePos.current = { x: clientX, y: clientY };
      return avoidBoundary(avoidOverlap(updated));
    });
  };

  const handleMouseUp = () => {
    setDraggedId(null);
    lastMousePos.current = null;
  };

  // 只在依赖变化时绑定一次事件监听器
  useEffect(() => {
    if (draggedId === null) return;

    const moveHandler = (e: MouseEvent | TouchEvent) => {
      requestAnimationFrame(() => handleMouseMove(e));
    };

    const upHandler = () => handleMouseUp();

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", upHandler);
    window.addEventListener("touchmove", moveHandler);
    window.addEventListener("touchend", upHandler);

    return () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", upHandler);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("touchend", upHandler);
    };
  }, [draggedId]);

  // 触摸支持
  const handleTouchStart = (e: React.TouchEvent, id: number) => {
    handleMouseDown(e, id);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // 已由全局监听处理
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  // 双击解绑某个泡泡，并检查对方是否也需要解除连接
  const handleDoubleClick = (id: number) => {
    setData((prev) => {
      setConnectedMap((map) => {
        const newMap = { ...map };
        const connections = newMap[id];

        if (connections) {
          connections.forEach((_, targetId) => {
            const targetConnections = newMap[targetId];
            if (targetConnections && targetConnections.size === 1 && targetConnections.has(id)) {
              delete newMap[targetId]; // 删除单向连接
            } else if (targetConnections) {
              const temp = new Map(targetConnections);
              temp.delete(id);
              newMap[targetId] = temp;
            }
          });
        }

        delete newMap[id]; // 删除当前泡泡的所有连接
        return newMap;
      });

      return [...prev];
    });
  };

  // 碰撞检测：防止泡泡重叠
  const avoidOverlap = (papers: Paper[]) => {
    const bubbleRadius = 30;
    const updatedPapers = [...papers];

    for (let i = 0; i < updatedPapers.length; i++) {
      for (let j = i + 1; j < updatedPapers.length; j++) {
        const a = updatedPapers[i];
        const b = updatedPapers[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        const minDistance = bubbleRadius * 2;

        if (distance < minDistance && distance > 0) {
          const overlap = (minDistance - distance) / distance / 2;
          const offsetX = dx * overlap;
          const offsetY = dy * overlap;

          updatedPapers[i].x += offsetX;
          updatedPapers[i].y += offsetY;
          updatedPapers[j].x -= offsetX;
          updatedPapers[j].y -= offsetY;
        }
      }
    }

    return updatedPapers;
  };

  // 边界限制函数
  const avoidBoundary = (papers: Paper[]) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return papers;

    const size = 60;
    const minX = 0;
    const maxX = rect.width - size;
    const minY = 0;
    const maxY = rect.height - size;

    return papers.map((p) => ({
      ...p,
      x: Math.max(minX, Math.min(maxX, p.x)),
      y: Math.max(minY, Math.min(maxY, p.y)),
    }));
  };

  // 吸附逻辑：基于圆心+半径判断
  const checkAndConnect = (currentData: Paper[], draggedId: number) => {
    const draggedPaper = currentData.find((p) => p.id === draggedId);
    if (!draggedPaper) return;

    setData((prev) => {
      const newMap = { ...connectedMap };
      const bubbleRadius = 30;

      prev.forEach((paper) => {
        if (paper.id === draggedId) return;

        const dx = paper.x - draggedPaper.x;
        const dy = paper.y - draggedPaper.y;
        const distance = Math.hypot(dx, dy);

        // 更容易连接（更大范围）
        if (distance < bubbleRadius * 3) {
          if (!newMap[draggedId]) newMap[draggedId] = new Map();
          if (!newMap[paper.id]) newMap[paper.id] = new Map();

          // 记录相对偏移
          newMap[draggedId].set(paper.id, { dx, dy });
          newMap[paper.id].set(draggedId, { dx: -dx, dy: -dy });
        }
      });

      setConnectedMap(newMap);
      return [...prev];
    });
  };

  // 使用 effect 仅用于触发吸附逻辑
  useEffect(() => {
    if (draggedId === null) return;

    const timer = setTimeout(() => {
      checkAndConnect(data, draggedId);
    }, 100);

    return () => clearTimeout(timer);
  }, [draggedId, data]);

  // 连接线绘制逻辑
  const getConnectionLines = () => {
    if (hoveredBubble === null) return null;

    const hoveredEl = document.querySelector(
      `.${styles.bubble}[data-id="${hoveredBubble}"]`
    );
    if (!hoveredBubble || !hoveredEl || !containerRef.current) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const hoveredRect = hoveredEl.getBoundingClientRect();

    const hoveredX =
      hoveredRect.left + hoveredRect.width / 2 - containerRect.left;
    const hoveredY =
      hoveredRect.top + hoveredRect.height / 2 - containerRect.top;

    return data.map((paper) => {
      if (paper.id === hoveredBubble) return null;

      const currentEl = document.querySelector(
        `.${styles.bubble}[data-id="${paper.id}"]`
      );
      if (!currentEl) return null;

      const currentRect = currentEl.getBoundingClientRect();
      const currentX =
        currentRect.left + currentRect.width / 2 - containerRect.left;
      const currentY =
        currentRect.top + currentRect.height / 2 - containerRect.top;

      const isConnected = connectedMap[hoveredBubble]?.has(paper.id);

      return (
        <line
          key={`line-${paper.id}`}
          x1={hoveredX}
          y1={hoveredY}
          x2={currentX}
          y2={currentY}
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            opacity: isConnected ? 0.8 : 0.4,
            transition: "opacity 0.3s ease-in-out",
          }}
          className={isConnected ? styles.connectedLine : ""}
        />
      );
    });
  };

  if (data.length === 0)
    return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Paper Network</h1>
      <div ref={containerRef} className={styles.bubbleContainer}>
        {data.map((paper) => {
          const isDragging = paper.id === draggedId;
          const isConnected = !!connectedMap[paper.id];

          return (
            <div
              key={paper.id}
              className={`${styles.bubble} ${
                hoveredBubble === paper.id ? styles.highlighted : ""
              } ${isDragging ? "dragging" : ""} ${isConnected ? styles.connected : ""}`}
              style={{
                transform: `translate(${paper.x}px, ${paper.y}px)`,
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
              onMouseEnter={() => setHoveredBubble(paper.id)}
              onMouseLeave={() => setHoveredBubble(null)}
              onMouseDown={(e) => handleMouseDown(e, paper.id)}
              onTouchStart={(e) => handleTouchStart(e, paper.id)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDoubleClick={() => handleDoubleClick(paper.id)}
              data-id={paper.id}
            >
              <div className={styles.bubbleInner}>
                <div className={styles.paperName}>{paper.name}</div>
                <div className={styles.paperDetails}>Author: {paper.author}</div>
                <div className={styles.paperDetails}>Year: {paper.time}</div>
              </div>
              <div className={styles.bubbleGlow}></div>
            </div>
          );
        })}

        <svg className={styles.connections} width="100%" height="100%">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d2ff" />
              <stop offset="50%" stopColor="#3a7bd5" />
              <stop offset="100%" stopColor="#00d2ff" />
            </linearGradient>
          </defs>
          {getConnectionLines()}
        </svg>
      </div>
    </div>
  );
}