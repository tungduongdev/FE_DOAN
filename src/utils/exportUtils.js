import * as XLSX from 'xlsx'

// Export dashboard data to Excel
export const exportToExcel = (dashboardData, filename = 'dashboard-report') => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Overview Sheet
    const overviewData = [
      ['Dashboard Overview Report'],
      ['Generated on:', new Date().toLocaleDateString()],
      [''],
      ['Metric', 'Value'],
      ['Total Tasks', dashboardData.stats.totalTasks],
      ['Completed Tasks', dashboardData.stats.completedTasks],
      ['In Progress Tasks', dashboardData.stats.inProgressTasks],
      ['Pending Tasks', dashboardData.stats.pendingTasks],
      ['Total Members', dashboardData.stats.totalMembers],
      ['Completion Rate', `${dashboardData.completionPercentage}%`]
    ]

    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData)
    XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Overview')

    // Task Distribution Sheet
    const taskDistributionData = [
      ['Task Distribution'],
      [''],
      ['Status', 'Count', 'Percentage'],
      ['Completed', dashboardData.stats.completedTasks, `${((dashboardData.stats.completedTasks / dashboardData.stats.totalTasks) * 100).toFixed(1)}%`],
      ['In Progress', dashboardData.stats.inProgressTasks, `${((dashboardData.stats.inProgressTasks / dashboardData.stats.totalTasks) * 100).toFixed(1)}%`],
      ['To Do', dashboardData.stats.pendingTasks, `${((dashboardData.stats.pendingTasks / dashboardData.stats.totalTasks) * 100).toFixed(1)}%`]
    ]

    const taskDistributionSheet = XLSX.utils.aoa_to_sheet(taskDistributionData)
    XLSX.utils.book_append_sheet(workbook, taskDistributionSheet, 'Task Distribution')

    // Weekly Progress Sheet
    const weeklyProgressData = [
      ['Weekly Progress'],
      [''],
      ['Day', 'Tasks Completed', 'Tasks Created'],
      ...dashboardData.weeklyProgressData.map(day => [day.day, day.completed, day.created])
    ]

    const weeklyProgressSheet = XLSX.utils.aoa_to_sheet(weeklyProgressData)
    XLSX.utils.book_append_sheet(workbook, weeklyProgressSheet, 'Weekly Progress')

    // Team Members Sheet
    const teamMembersData = [
      ['Team Members'],
      [''],
      ['Name', 'Email', 'Role', 'Progress']
    ]

    if (dashboardData.teamMembers && dashboardData.teamMembers.length > 0) {
      dashboardData.teamMembers.forEach((member, index) => {
        teamMembersData.push([
          member.displayName || 'Unknown User',
          member.email || 'No email',
          dashboardData.owners.some(owner => owner._id === member._id) ? 'Owner' : 'Member',
          `${50 + (index * 10) % 50}%` // Placeholder progress
        ])
      })
    }

    const teamMembersSheet = XLSX.utils.aoa_to_sheet(teamMembersData)
    XLSX.utils.book_append_sheet(workbook, teamMembersSheet, 'Team Members')

    // Write the file
    XLSX.writeFile(workbook, `${filename}.xlsx`)

    return { success: true, message: 'Excel file exported successfully!' }
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    return { success: false, message: 'Failed to export Excel file' }
  }
}
