"use client";
import { History, CheckCircle, Error, PersonAdd, EditNote } from "@mui/icons-material";
import React, { useEffect, useState } from "react";

const ActivityPanel = ({ dealId }: { dealId?: string }) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dealId) {
      fetchActivities();
      // Poll every 30 seconds for new activities
      const interval = setInterval(fetchActivities, 30000);
      return () => clearInterval(interval);
    }
  }, [dealId]);

  const fetchActivities = async () => {
    if (!dealId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/activity?id=${dealId}`);
      const data = await response.json();
      if (response.ok) {
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "issue_created":
        return <Error className="text-amber-500" fontSize="small" />;
      case "proposal_created":
        return <EditNote className="text-blue-500" fontSize="small" />;
      case "proposal_accepted":
        return <CheckCircle className="text-green-500" fontSize="small" />;
      case "proposal_rejected":
        return <Error className="text-red-500" fontSize="small" />;
      case "participant_joined":
        return <PersonAdd className="text-violet-500" fontSize="small" />;
      default:
        return <History className="text-gray-500" fontSize="small" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-sm text-gray-500">Loading activity...</div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border border-[#e2e8f0] shadow-sm mb-6">
          <span className="text-slate-300 text-[40px] font-light">
            <History fontSize="inherit" />
          </span>
        </div>
        <h3 className="font-bold text-lg text-[#0f172a] mb-2">No activity yet</h3>
        <p className="text-sm text-[#64748b] leading-relaxed mb-8">
          The audit trail will appear here as soon as participants start raising
          issues or proposing changes.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="p-4 border-b border-[#e2e8f0] bg-white">
        <h3 className="text-sm font-bold text-[#0f172a]">Activity Feed</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3 bg-white p-4 rounded-lg border border-[#e2e8f0] hover:shadow-sm transition-shadow">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#0f172a] font-medium">{activity.title}</p>
                <p className="text-xs text-[#64748b] mt-1">
                  {activity.user} · {formatTimestamp(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityPanel;
