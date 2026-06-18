import { describe, it, expect } from "vitest";
import { toEmbed } from "@lib/video";

describe("toEmbed", () => {
  it("converts a Vimeo watch URL to an embed URL", () => {
    expect(toEmbed("https://vimeo.com/40234826")).toBe(
      "https://player.vimeo.com/video/40234826?autoplay=1",
    );
  });

  it("converts a YouTube watch URL to an embed URL", () => {
    expect(toEmbed("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
    );
  });

  it("converts a youtu.be short URL to an embed URL", () => {
    expect(toEmbed("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
    );
  });

  it("returns the original URL for unknown hosts", () => {
    expect(toEmbed("https://example.com/video")).toBe(
      "https://example.com/video",
    );
  });

  it("returns the original string for invalid URLs", () => {
    expect(toEmbed("not-a-url")).toBe("not-a-url");
  });
});
