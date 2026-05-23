// @vitest-environment jsdom
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useSeo } from "@/utils/useSeo";

describe("useSeo", () => {
  beforeEach(() => {
    document.title = "";
  });

  it("주어진 title로 document.title을 설정한다", () => {
    renderHook(() => useSeo("이종은 | 포트폴리오"));
    expect(document.title).toBe("이종은 | 포트폴리오");
  });

  it("title이 변경되면 document.title도 업데이트한다", () => {
    const { rerender } = renderHook(({ title }) => useSeo(title), {
      initialProps: { title: "첫 번째 타이틀" },
    });
    expect(document.title).toBe("첫 번째 타이틀");

    rerender({ title: "두 번째 타이틀" });
    expect(document.title).toBe("두 번째 타이틀");
  });
});
