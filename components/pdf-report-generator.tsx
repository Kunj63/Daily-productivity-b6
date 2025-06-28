"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDown } from "lucide-react"
import type { Task } from "@/types/productivity"

interface PDFReportGeneratorProps {
  date: string
  checkInTime: string | null
  checkOutTime: string | null
  totalAwakeTime: number
  totalProductiveTime: number
  totalNonProductiveTime: number
  tasks: Task[]
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function PDFReportGenerator({
  date,
  checkInTime,
  checkOutTime,
  totalAwakeTime,
  totalProductiveTime,
  totalNonProductiveTime,
  tasks,
}: PDFReportGeneratorProps) {
  const generateReport = () => {
    const productivityPercentage = totalAwakeTime > 0 ? Math.round((totalProductiveTime / totalAwakeTime) * 100) : 0

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Daily Productivity Report - ${formatDate(date)}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6; 
              color: #333; 
              background: #f8f9fa;
              padding: 20px;
            }
            .container { 
              max-width: 800px; 
              margin: 0 auto; 
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              padding: 30px;
              text-align: center;
            }
            .header h1 { 
              font-size: 28px; 
              margin-bottom: 8px;
              font-weight: 700;
            }
            .header p { 
              font-size: 16px; 
              opacity: 0.9;
            }
            .content { padding: 30px; }
            .stats-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
              gap: 20px; 
              margin-bottom: 30px;
            }
            .stat-card { 
              background: #f8f9fa;
              border: 2px solid #e9ecef;
              border-radius: 12px;
              padding: 20px;
              text-align: center;
              transition: transform 0.2s;
            }
            .stat-card:hover { transform: translateY(-2px); }
            .stat-value { 
              font-size: 24px; 
              font-weight: 700; 
              margin-bottom: 5px;
              font-family: 'SF Mono', Monaco, monospace;
            }
            .stat-label { 
              font-size: 14px; 
              color: #6c757d;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .productive { color: #28a745; border-color: #28a745; }
            .non-productive { color: #ffc107; border-color: #ffc107; }
            .total { color: #007bff; border-color: #007bff; }
            .section { margin-bottom: 30px; }
            .section h2 { 
              font-size: 20px; 
              margin-bottom: 15px;
              color: #495057;
              border-bottom: 2px solid #e9ecef;
              padding-bottom: 8px;
            }
            .task-list { 
              display: grid; 
              gap: 12px;
            }
            .task-item { 
              background: #f8f9fa;
              border-left: 4px solid #007bff;
              padding: 15px;
              border-radius: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .task-info h3 { 
              font-size: 16px; 
              margin-bottom: 4px;
              color: #495057;
            }
            .task-info p { 
              font-size: 14px; 
              color: #6c757d;
            }
            .task-duration { 
              font-family: 'SF Mono', Monaco, monospace;
              font-size: 16px;
              font-weight: 600;
              color: #007bff;
            }
            .summary { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              border-radius: 12px;
              text-align: center;
            }
            .summary h3 { 
              font-size: 18px; 
              margin-bottom: 10px;
            }
            .summary p { 
              font-size: 16px;
              opacity: 0.9;
            }
            .no-tasks { 
              text-align: center; 
              color: #6c757d; 
              font-style: italic;
              padding: 20px;
            }
            @media print {
              body { background: white; padding: 0; }
              .container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Daily Productivity Report</h1>
              <p>${formatDate(date)}</p>
            </div>
            
            <div class="content">
              <div class="stats-grid">
                <div class="stat-card total">
                  <div class="stat-value">${formatTime(totalAwakeTime)}</div>
                  <div class="stat-label">Total Awake Time</div>
                </div>
                <div class="stat-card productive">
                  <div class="stat-value">${formatTime(totalProductiveTime)}</div>
                  <div class="stat-label">Productive Time</div>
                </div>
                <div class="stat-card non-productive">
                  <div class="stat-value">${formatTime(totalNonProductiveTime)}</div>
                  <div class="stat-label">Non-Productive Time</div>
                </div>
              </div>

              <div class="section">
                <h2>Session Details</h2>
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-value">${checkInTime || "N/A"}</div>
                    <div class="stat-label">Check-in Time</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">${checkOutTime || "N/A"}</div>
                    <div class="stat-label">Check-out Time</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">${productivityPercentage}%</div>
                    <div class="stat-label">Productivity Rate</div>
                  </div>
                </div>
              </div>

              <div class="section">
                <h2>Task Breakdown</h2>
                ${
                  tasks.length > 0
                    ? `
                  <div class="task-list">
                    ${tasks
                      .map(
                        (task) => `
                      <div class="task-item">
                        <div class="task-info">
                          <h3>${task.title}</h3>
                          ${task.description ? `<p>${task.description}</p>` : ""}
                        </div>
                        <div class="task-duration">${formatTime(task.duration)}</div>
                      </div>
                    `,
                      )
                      .join("")}
                  </div>
                `
                    : `
                  <div class="no-tasks">No tasks were tracked today.</div>
                `
                }
              </div>

              <div class="summary">
                <h3>Daily Summary</h3>
                <p>
                  You were productive for ${productivityPercentage}% of your awake time today.
                  ${
                    productivityPercentage >= 70
                      ? "Excellent work! 🎉"
                      : productivityPercentage >= 50
                        ? "Good effort! Keep it up! 👍"
                        : "Room for improvement tomorrow! 💪"
                  }
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `productivity-report-${date}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="bg-[#1A1A1A] border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Daily Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-400 text-sm">
          Your day is complete! Generate a comprehensive report of your productivity.
        </p>
        <Button onClick={generateReport} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          <FileDown className="w-4 h-4 mr-2" />
          Download Daily Report
        </Button>
      </CardContent>
    </Card>
  )
}
