import { ActivityStore } from "@/lib/stores/activityStore"
import { BoardStore } from "@/lib/stores/boardStore"
import { useEffect } from "react"

export default function ActivityFeed() {
    const selectedBoard = BoardStore((s) => s.selectedBoard)
    const logs = ActivityStore((s) => s.logs)
    const loading = ActivityStore((s) => s.loading)
    const fetchLogs = ActivityStore((s) => s.fetchlogs)

    useEffect(() => {
        if (selectedBoard.id) {
            fetchLogs(selectedBoard.id)
        }
    }, [selectedBoard.id, fetchLogs])

    if (loading) return <p>Loading activity feed...</p>;
    if (!logs.length) return <p>No activity yet.</p>;

    return (
        <div>
            <h3>Activity Feed</h3>
            <ul>
                {logs.map((log) => (
                    <li key={log.id} style={{ marginBottom: "0.5rem" }}>
                        <strong>{log.user?.username + " "|| "Unknown User"}</strong>
                        <span>{log.details}</span>{" "}
                        <em style={{ color: "gray", fontSize: "0.85rem" }}>
                            ({new Date(log.timestamp).toLocaleString()})
                        </em>
                    </li>
                ))}
            </ul>
        </div>
    )
}