import { describe, expect, it } from "vitest";
import type { TimelineItem } from "@/types/about";

// 컴포넌트에서 export 될 함수들 (아직 없음 — 이 단계에서 실패해야 함)
import { getStartYear, buildYearGroups } from "@/components/about/AboutTimeline";

const makeItem = (
  type: TimelineItem["type"],
  period: string,
  title: string,
): TimelineItem => ({ type, period, title, organization: "org", description: "desc" });

describe("getStartYear", () => {
  it("period 앞 4자리를 연도로 반환한다", () => {
    expect(getStartYear("2026.04 ~ 진행 중")).toBe(2026);
    expect(getStartYear("2025.05 ~ 2025.07")).toBe(2025);
    expect(getStartYear("2017.02 ~ 2023.02")).toBe(2017);
  });
});

describe("buildYearGroups", () => {
  it("최신 연도가 먼저 오도록 내림차순 정렬한다", () => {
    const items = [
      makeItem("education", "2017.02 ~ 2023.02", "대학교"),
      makeItem("project", "2026.04 ~ 진행 중", "AI Pipeline"),
    ];
    const groups = buildYearGroups(items);
    expect(groups[0].year).toBe(2026);
    expect(groups[1].year).toBe(2017);
  });

  it("type === 'project' 항목은 right에, 나머지는 left에 배치한다", () => {
    const items = [
      makeItem("project", "2025.11 ~ 2025.01", "ChatGPT"),
      makeItem("bootcamp", "2025.04 ~ 2025.07", "Kernel360"),
      makeItem("career", "2025.05 ~ 2025.07", "가사도우미"),
    ];
    const groups = buildYearGroups(items);
    expect(groups[0].year).toBe(2025);
    const { rows } = groups[0];
    const rightItems = rows.map((r) => r.right).filter(Boolean);
    const leftItems = rows.map((r) => r.left).filter(Boolean);
    expect(rightItems).toHaveLength(1);
    expect(rightItems[0]?.title).toBe("ChatGPT");
    expect(leftItems).toHaveLength(2);
  });

  it("한쪽이 더 많으면 나머지 행은 null로 채운다", () => {
    const items = [
      makeItem("bootcamp", "2025.04 ~ 2025.07", "Kernel360"),
      makeItem("career", "2025.05 ~ 2025.07", "가사도우미"),
    ];
    const groups = buildYearGroups(items);
    expect(groups[0].rows).toHaveLength(2);
    expect(groups[0].rows[0].right).toBeNull();
    expect(groups[0].rows[1].right).toBeNull();
  });
});
