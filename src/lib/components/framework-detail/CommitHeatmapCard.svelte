<script lang="ts">
  import BaseCard from './BaseCard.svelte';

  export let commitActivity: any[] | undefined;
  export let brandColor: string | undefined = undefined;

  interface DayData {
    date: Date;
    commits: number;
    weekIndex: number;
    dayIndex: number;
  }

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function processCommitData(activity: any[]): DayData[] {
    if (!activity || !Array.isArray(activity) || activity.length === 0) return [];

    const days: DayData[] = [];

    activity.forEach((week, weekIndex) => {
      if (!week || !week.days || !Array.isArray(week.days)) return;
      week.days.forEach((commits: number, dayIndex: number) => {
        const date = new Date(week.week * 1000);
        date.setDate(date.getDate() + dayIndex);

        days.push({
          date,
          commits,
          weekIndex,
          dayIndex
        });
      });
    });

    return days;
  }

  function groupDaysByMonth(days: DayData[]): Map<string, { name: string; weeks: DayData[][] }> {
    const monthMap = new Map<string, DayData[]>();

    days.forEach(day => {
      const monthKey = `${day.date.getFullYear()}-${day.date.getMonth()}`;
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, []);
      }
      monthMap.get(monthKey)!.push(day);
    });

    // Convert to weeks structure with exactly 7 days per week
    const result = new Map<string, { name: string; weeks: DayData[][] }>();

    monthMap.forEach((monthDays, key) => {
      const [year, monthIndex] = key.split('-').map(Number);
      const monthName = `${MONTHS[monthIndex]} ${year}`;

      // Group days into weeks of exactly 7 days
      const weeks: DayData[][] = [];
      for (let i = 0; i < monthDays.length; i += 7) {
        const week = monthDays.slice(i, i + 7);
        // Pad week to exactly 7 days if needed
        while (week.length < 7) {
          const lastDate = week[week.length - 1]?.date || new Date(year, monthIndex, 1);
          const nextDate = new Date(lastDate);
          nextDate.setDate(nextDate.getDate() + 1);
          week.push({
            date: nextDate,
            commits: 0,
            weekIndex: 0,
            dayIndex: week.length
          });
        }
        weeks.push(week);
      }

      result.set(key, { name: monthName, weeks });
    });

    return result;
  }

  function getCommitColor(commits: number, maxCommits: number): string {
    if (commits === 0) return 'rgba(100, 116, 139, 0.15)'; // Lighter gray for no commits

    const intensity = commits / maxCommits;
    const baseColor = brandColor || '#3b82f6';

    if (intensity <= 0.25) return `${baseColor}33`; // 20% opacity
    if (intensity <= 0.5) return `${baseColor}66`;  // 40% opacity
    if (intensity <= 0.75) return `${baseColor}99`; // 60% opacity
    return baseColor; // 100% opacity
  }

  function getMonthLabels(days: DayData[]): { month: string; position: number }[] {
    const labels: { month: string; position: number }[] = [];
    let lastMonth = -1;

    days.forEach((day, index) => {
      const month = day.date.getMonth();
      if (month !== lastMonth && index % 7 === 0) {
        labels.push({
          month: MONTHS[month],
          position: Math.floor(index / 7)
        });
        lastMonth = month;
      }
    });

    return labels;
  }

  $: days = commitActivity ? processCommitData(commitActivity) : [];
  $: maxCommits = days.length > 0 ? Math.max(...days.map(d => d.commits)) : 0;
  $: totalCommits = days.reduce((sum, d) => sum + d.commits, 0);
  $: avgCommitsPerDay = days.length > 0 ? (totalCommits / days.length).toFixed(1) : 0;
  $: monthLabels = getMonthLabels(days);
  $: weeks = days.length > 0 ? Math.ceil(days.length / 7) : 0;
  $: monthGroups = groupDaysByMonth(days);

  // Check if we have enough space to show full year view
  let containerWidth = 0;
  let showFullYear = false;
  $: {
    // Rough calculation: each week needs ~15px (12px cell + 3px gap)
    // Plus margins and labels ~100px
    const neededWidth = weeks * 15 + 100;
    showFullYear = containerWidth >= neededWidth && containerWidth > 800;
  }
</script>

<BaseCard title="Commit Activity" size="wide" headerSlot={true}>
  <div slot="header" class="card-header-content">
    <h3>Commit Activity</h3>
    <div class="stats">
      <div class="stat-item">
        <span class="stat-value">{totalCommits.toLocaleString()}</span>
        <span class="stat-label">commits</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{avgCommitsPerDay}</span>
        <span class="stat-label">per day</span>
      </div>
    </div>
  </div>

  {#if days.length > 0}
    <div class="heatmap-wrapper" bind:clientWidth={containerWidth}>
      {#if showFullYear}
        <!-- Full year continuous view -->
        <div class="full-year-view">
          <div class="day-labels">
            {#each [1, 3, 5] as dayIndex}
              <span class="day-label">{DAYS[dayIndex]}</span>
            {/each}
          </div>
          <div class="full-year-container">
            <div class="month-labels">
              {#each monthLabels as { month, position }}
                <span class="month-label" style="left: calc({position} * (var(--cell-size) + var(--cell-gap)))">{month}</span>
              {/each}
            </div>
            <div class="heatmap-grid full-year" style="--weeks: {weeks}">
              {#each days as day}
                <div
                  class="day-cell"
                  style="background-color: {getCommitColor(day.commits, maxCommits)}"
                  title="{day.date.toLocaleDateString()}: {day.commits} commits"
                  role="img"
                  aria-label="{day.commits} commits on {day.date.toLocaleDateString()}"
                >
                </div>
              {/each}
            </div>
          </div>
        </div>
      {:else}
        <!-- Monthly grouped view -->
        <div class="heatmap-months">
          {#each Array.from(monthGroups.entries()) as [monthKey, { name, weeks: monthWeeks }]}
            <div class="month-group">
              <div class="month-header">
                <span class="month-name">{name}</span>
              </div>
              <div class="month-heatmap">
                <div class="day-labels-inline">
                  {#each [1, 3, 5] as dayIndex}
                    <span class="day-label-inline">{DAYS[dayIndex].charAt(0)}</span>
                  {/each}
                </div>
                <div class="heatmap-grid" style="--weeks: {monthWeeks.length}">
                  {#each monthWeeks as week}
                    {#each week as day}
                      <div
                        class="day-cell"
                        style="background-color: {getCommitColor(day.commits, maxCommits)}"
                        title="{day.date.toLocaleDateString()}: {day.commits} commits"
                        role="img"
                        aria-label="{day.commits} commits on {day.date.toLocaleDateString()}"
                      >
                      </div>
                    {/each}
                  {/each}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      <div class="legend">
        <span class="legend-label">Less</span>
        <div class="legend-scale">
          <div class="legend-cell" style="background-color: rgba(100, 116, 139, 0.15)"></div>
          <div class="legend-cell" style="background-color: {brandColor || '#3b82f6'}33"></div>
          <div class="legend-cell" style="background-color: {brandColor || '#3b82f6'}66"></div>
          <div class="legend-cell" style="background-color: {brandColor || '#3b82f6'}99"></div>
          <div class="legend-cell" style="background-color: {brandColor || '#3b82f6'}"></div>
        </div>
        <span class="legend-label">More</span>
      </div>
    </div>
  {:else}
    <div class="no-data">
      <p>No commit activity data available</p>
    </div>
  {/if}
</BaseCard>

<style>
  .heatmap-wrapper {
    --cell-size: 12px;
    --cell-gap: 3px;
  }

  .card-header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--gap-md);
    width: 100%;
  }

  .card-header-content h3 {
    margin: 0;
    font-size: var(--font-lg);
  }

  .stats {
    display: flex;
    gap: var(--gap-lg);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .stat-value {
    font-size: var(--font-xl);
    font-weight: 700;
    color: var(--brand-color, var(--accent-primary));
    line-height: 1;
  }

  .stat-label {
    font-size: var(--font-xs);
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .heatmap-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
    width: 100%;
  }

  .full-year-view {
    display: flex;
    gap: var(--gap-md);
    width: 100%;
  }

  .day-labels {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-top: 20px;
    gap: calc(var(--cell-size) * 2 + var(--cell-gap) * 2);
  }

  .day-label {
    font-size: var(--font-2xs);
    color: var(--text-tertiary);
    text-align: right;
    line-height: var(--cell-size);
  }

  .full-year-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    overflow-x: auto;
  }

  .month-labels {
    position: relative;
    height: 16px;
    margin-bottom: var(--gap-xs);
  }

  .month-label {
    position: absolute;
    font-size: var(--font-2xs);
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .heatmap-months {
    display: flex;
    gap: var(--gap-lg);
    overflow-x: auto;
    padding: var(--gap-sm) 0;
  }

  .month-group {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    flex-shrink: 0;
  }

  .month-header {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 20px;
  }

  .month-name {
    font-size: var(--font-xs);
    color: var(--text-secondary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .month-heatmap {
    display: flex;
    gap: var(--gap-xs);
  }

  .day-labels-inline {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    gap: calc(var(--cell-size) * 2 + var(--cell-gap) * 2);
    padding-top: 2px;
  }

  .day-label-inline {
    font-size: 9px;
    color: var(--text-tertiary);
    text-align: center;
    line-height: var(--cell-size);
    width: 12px;
  }

  .heatmap-grid {
    display: grid;
    grid-template-columns: repeat(var(--weeks), var(--cell-size));
    grid-auto-flow: column;
    grid-template-rows: repeat(7, var(--cell-size));
    gap: var(--cell-gap);
    padding: var(--gap-sm);
    background: var(--surface-tertiary);
    border-radius: var(--radius-md);
  }

  .heatmap-grid.full-year {
    padding: var(--gap-md);
    width: fit-content;
  }

  .day-cell {
    width: var(--cell-size);
    height: var(--cell-size);
    border-radius: 2px;
    cursor: pointer;
    transition: transform var(--transition-fast);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .day-cell:hover {
    transform: scale(1.3);
    outline: 2px solid var(--text-primary);
    outline-offset: 1px;
    z-index: 10;
    border-color: transparent;
  }

  .legend {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    justify-content: flex-end;
    padding: 0 var(--gap-md);
  }

  .legend-label {
    font-size: var(--font-2xs);
    color: var(--text-tertiary);
  }

  .legend-scale {
    display: flex;
    gap: var(--cell-gap);
  }

  .legend-cell {
    width: var(--cell-size);
    height: var(--cell-size);
    border-radius: 2px;
  }

  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--gap-xl);
    color: var(--text-tertiary);
    font-style: italic;
  }

  @media (max-width: 1200px) {
    .heatmap-months {
      flex-wrap: wrap;
    }

    .full-year-view .day-labels {
      display: none;
    }
  }

  @media (max-width: 768px) {
    :global(.commit-heatmap-card) {
      --cell-size: 10px;
      --cell-gap: 2px;
    }

    .card-header-content {
      flex-direction: column;
      align-items: flex-start;
    }

    .stats {
      width: 100%;
      justify-content: space-around;
    }

    .heatmap-months {
      gap: var(--gap-md);
    }

    .day-label-inline {
      font-size: 8px;
      width: 10px;
    }

    .month-labels {
      display: none;
    }
  }

  @media (max-width: 480px) {
    :global(.commit-heatmap-card) {
      --cell-size: 8px;
      --cell-gap: 1px;
    }

    .heatmap-months {
      gap: var(--gap-sm);
    }

    .month-name {
      font-size: 10px;
    }

    .day-label-inline {
      font-size: 7px;
      width: 8px;
    }
  }
</style>
