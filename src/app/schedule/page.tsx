"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  GripVertical,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PlatformIcon from "@/components/ui/PlatformIcon";
import { useContentStore } from "@/lib/store";
import { Platform } from "@/lib/types";
import { getPlatformName } from "@/lib/utils";

const connectedPlatforms: {
  platform: Platform;
  connected: boolean;
  username?: string;
}[] = [
  { platform: "twitter", connected: true, username: "@yourhandle" },
  { platform: "instagram", connected: true, username: "@yourhandle" },
  { platform: "linkedin", connected: true, username: "Your Name" },
  { platform: "tiktok", connected: false },
  { platform: "shorts", connected: false },
  { platform: "newsletter", connected: true, username: "your@email.com" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_NUMS = [3, 4, 5, 6, 7, 8, 9];

interface ScheduledItem {
  id: string;
  platform: Platform;
  title: string;
  time: string;
  day: string;
  status: "scheduled" | "draft";
}

const UNSCHEDULED_POOL: ScheduledItem[] = [
  {
    id: "u-1",
    platform: "twitter",
    title: "Growth Tips Thread",
    time: "",
    day: "",
    status: "draft",
  },
  {
    id: "u-2",
    platform: "tiktok",
    title: "Key Moment Clip",
    time: "",
    day: "",
    status: "draft",
  },
  {
    id: "u-3",
    platform: "instagram",
    title: "Carousel: Framework",
    time: "",
    day: "",
    status: "draft",
  },
];

const INITIAL_CALENDAR: ScheduledItem[] = [
  {
    id: "c-1",
    platform: "twitter",
    title: "Content Creation Thread",
    time: "9:00 AM",
    day: "Mon",
    status: "scheduled",
  },
  {
    id: "c-2",
    platform: "instagram",
    title: "Repurposing Carousel",
    time: "11:00 AM",
    day: "Mon",
    status: "scheduled",
  },
  {
    id: "c-3",
    platform: "linkedin",
    title: "Professional Post",
    time: "8:00 AM",
    day: "Tue",
    status: "scheduled",
  },
  {
    id: "c-4",
    platform: "newsletter",
    title: "Weekly Newsletter",
    time: "7:00 AM",
    day: "Tue",
    status: "scheduled",
  },
  {
    id: "c-5",
    platform: "shorts",
    title: "YouTube Short",
    time: "2:00 PM",
    day: "Thu",
    status: "scheduled",
  },
];

function DraggableItem({ item }: { item: ScheduledItem }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface cursor-grab active:cursor-grabbing transition-all ${
        isDragging
          ? "opacity-40"
          : "hover:border-primary/30 hover:shadow-sm"
      }`}
    >
      <GripVertical className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
      <PlatformIcon platform={item.platform} size={14} />
      <span className="text-xs font-medium truncate">{item.title}</span>
    </div>
  );
}

function CalendarCell({
  day,
  dayNum,
  items,
  isToday,
}: {
  day: string;
  dayNum: number;
  items: ScheduledItem[];
  isToday: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: `cell-${day}` });
  return (
    <div
      ref={setNodeRef}
      className={`border-r border-border last:border-r-0 min-h-[220px] transition-colors ${
        isOver ? "bg-primary/5" : isToday ? "bg-primary/[0.02]" : ""
      }`}
    >
      <div
        className={`px-2 py-3 text-center border-b border-border ${
          isToday ? "bg-primary/5" : "bg-surface-hover"
        }`}
      >
        <p
          className={`text-xs font-medium ${
            isToday ? "text-primary" : "text-secondary"
          }`}
        >
          {day}
        </p>
        <p
          className={`text-lg font-semibold mt-0.5 ${
            isToday ? "text-primary" : ""
          }`}
        >
          {dayNum}
        </p>
      </div>

      <div className="p-1.5 space-y-1.5">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-2 rounded-lg border text-xs ${
              item.status === "scheduled"
                ? "bg-primary/5 border-primary/20"
                : "bg-warning/5 border-warning/20"
            }`}
          >
            <div className="flex items-center gap-1 mb-0.5">
              <PlatformIcon platform={item.platform} size={10} />
              <span className="font-medium text-[10px] truncate">
                {getPlatformName(item.platform).split("/")[0]}
              </span>
            </div>
            <p className="text-[10px] text-secondary truncate">{item.title}</p>
            {item.time && (
              <div className="flex items-center gap-1 mt-1 text-[10px] text-secondary">
                <Clock className="w-2.5 h-2.5" />
                {item.time}
              </div>
            )}
          </motion.div>
        ))}

        {isOver && (
          <div className="h-10 border-2 border-dashed border-primary/40 rounded-lg flex items-center justify-center">
            <span className="text-[10px] text-primary/60">Drop here</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const { initializeMockData } = useContentStore();
  const [calendarItems, setCalendarItems] =
    useState<ScheduledItem[]>(INITIAL_CALENDAR);
  const [unscheduled, setUnscheduled] =
    useState<ScheduledItem[]>(UNSCHEDULED_POOL);
  const [activeItem, setActiveItem] = useState<ScheduledItem | null>(null);

  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const all = [...calendarItems, ...unscheduled];
    setActiveItem(all.find((i) => i.id === event.active.id) || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;
    const overId = String(over.id);
    if (!overId.startsWith("cell-")) return;
    const targetDay = overId.replace("cell-", "");
    const itemId = String(active.id);

    const fromUnscheduled = unscheduled.find((u) => u.id === itemId);
    if (fromUnscheduled) {
      setUnscheduled((prev) => prev.filter((u) => u.id !== itemId));
      setCalendarItems((prev) => [
        ...prev,
        {
          ...fromUnscheduled,
          day: targetDay,
          time: "9:00 AM",
          status: "scheduled",
        },
      ]);
    } else {
      setCalendarItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, day: targetDay } : item
        )
      );
    }
  };

  const scheduledCount = calendarItems.filter(
    (i) => i.status === "scheduled"
  ).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Schedule</h1>
            <p className="text-secondary">
              Drag assets onto the calendar to schedule them.
            </p>
          </div>
          <Link href="/create">
            <Button size="sm">
              <Plus className="w-4 h-4" />
              Add Content
            </Button>
          </Link>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Ready to Schedule
                </h3>
                {unscheduled.length > 0 ? (
                  <div className="space-y-2">
                    {unscheduled.map((item) => (
                      <DraggableItem key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-secondary text-center py-4">
                    All assets scheduled! 🎉
                  </p>
                )}
                <p className="text-xs text-secondary mt-3">
                  Drag any item onto a calendar day.
                </p>
              </Card>

              <Card>
                <h3 className="font-semibold text-sm mb-4">Connections</h3>
                <div className="space-y-3">
                  {connectedPlatforms.map((cp) => (
                    <div
                      key={cp.platform}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <PlatformIcon
                          platform={cp.platform}
                          size={14}
                          withBackground
                        />
                        <div>
                          <p className="text-xs font-medium">
                            {getPlatformName(cp.platform).split("/")[0]}
                          </p>
                          {cp.username && (
                            <p className="text-[10px] text-secondary">
                              {cp.username}
                            </p>
                          )}
                        </div>
                      </div>
                      {cp.connected ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <button className="text-[10px] text-primary hover:underline">
                          Connect
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              <Card padding="sm">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-xl font-bold text-primary">
                      {scheduledCount}
                    </p>
                    <p className="text-xs text-secondary">Scheduled</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-warning">
                      {unscheduled.length}
                    </p>
                    <p className="text-xs text-secondary">Pending</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Calendar */}
            <div className="lg:col-span-3">
              <Card padding="none" className="overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Mar 3 – 9, 2026</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <Button variant="ghost" size="sm">
                      Today
                    </Button>
                    <button className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7">
                  {DAYS.map((day, idx) => (
                    <CalendarCell
                      key={day}
                      day={day}
                      dayNum={DAY_NUMS[idx]}
                      items={calendarItems.filter((i) => i.day === day)}
                      isToday={day === "Tue"}
                    />
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <DragOverlay>
            {activeItem && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary bg-surface shadow-xl text-xs font-medium rotate-2 cursor-grabbing">
                <PlatformIcon platform={activeItem.platform} size={14} />
                {activeItem.title}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
