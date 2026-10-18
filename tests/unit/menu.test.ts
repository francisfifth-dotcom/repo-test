import { describe, expect, it } from "vitest";
import { demoMenu, formatPrice } from "../../src/lib/menu";

describe("menu pricing", () => {
  it("formats integer cents without floating point price drift", () => {
    expect(formatPrice(450)).toBe("$4.50");
    expect(formatPrice(0)).toBe("$0.00");
    expect(formatPrice(1099)).toBe("$10.99");
  });
  it("has uniquely identified menu items and valid prices", () => {
    expect(new Set(demoMenu.map(item => item.id)).size).toBe(demoMenu.length);
    for (const item of demoMenu) {
      expect(item.name.length).toBeGreaterThan(0);
      expect(Number.isInteger(item.price_cents)).toBe(true);
      expect(item.price_cents).toBeGreaterThan(0);
    }
  });
});
