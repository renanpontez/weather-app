import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecentList } from "@/components/search/RecentList";
import type { RecentSearch } from "@weather-app/shared";

const mockSearches: RecentSearch[] = [
  {
    city: "Oslo",
    country: "Norway",
    country_code: "NO",
    latitude: 59.91,
    longitude: 10.75,
    temperature: 8,
    weather_code: 3,
    searched_at: new Date().toISOString(),
  },
  {
    city: "Bergen",
    country: "Norway",
    country_code: "NO",
    latitude: 60.39,
    longitude: 5.32,
    temperature: 12,
    weather_code: 61,
    searched_at: new Date(Date.now() - 60_000).toISOString(),
  },
];

const defaultProps = {
  searches: mockSearches,
  unit: "celsius" as const,
  loading: false,
  onSelect: vi.fn(),
  onRemove: vi.fn(),
  onClearAll: vi.fn(),
};

describe("RecentList", () => {
  it("renders nothing when searches are empty", () => {
    const { container } = render(<RecentList {...defaultProps} searches={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("shows loading skeletons when loading", () => {
    render(<RecentList {...defaultProps} loading={true} searches={[]} />);
    expect(screen.getByText("Recent searches")).toBeInTheDocument();
  });

  it("renders search cards with city and temperature", () => {
    render(<RecentList {...defaultProps} />);
    expect(screen.getByText("Oslo")).toBeInTheDocument();
    expect(screen.getByText("Bergen")).toBeInTheDocument();
    expect(screen.getByText("8°C")).toBeInTheDocument();
    expect(screen.getByText("12°C")).toBeInTheDocument();
  });

  it("shows count label", () => {
    render(<RecentList {...defaultProps} />);
    expect(screen.getByText("2/10")).toBeInTheDocument();
  });

  it("calls onSelect when a card is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<RecentList {...defaultProps} onSelect={onSelect} />);

    await user.click(screen.getByLabelText("Select Oslo, Norway"));
    expect(onSelect).toHaveBeenCalledWith(mockSearches[0]);
  });

  it("calls onClearAll when clear button is clicked", async () => {
    const user = userEvent.setup();
    const onClearAll = vi.fn();
    render(<RecentList {...defaultProps} onClearAll={onClearAll} />);

    await user.click(screen.getByLabelText("Clear all recent searches"));
    expect(onClearAll).toHaveBeenCalled();
  });

  it("highlights active city", () => {
    render(<RecentList {...defaultProps} activeCity="Oslo" />);
    const osloButton = screen.getByLabelText("Select Oslo, Norway");
    expect(osloButton.className).toContain("border-primary/30");
  });

  it("cards are keyboard accessible (button elements)", () => {
    render(<RecentList {...defaultProps} />);
    const buttons = screen.getAllByRole("button");
    const cardButtons = buttons.filter((b) => b.getAttribute("aria-label")?.startsWith("Select"));
    expect(cardButtons).toHaveLength(2);
    cardButtons.forEach((b) => expect(b.tagName).toBe("BUTTON"));
  });
});
