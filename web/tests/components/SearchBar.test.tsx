import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import * as citySearch from "@/hooks/useCitySearch";

const mockResults = [
  { id: 1, name: "Oslo", latitude: 59.91, longitude: 10.75, country: "Norway", country_code: "NO", admin1: "Oslo" },
  { id: 2, name: "Osaka", latitude: 34.69, longitude: 135.5, country: "Japan", country_code: "JP", admin1: "Osaka" },
];

let mockState = {
  query: "",
  setQuery: vi.fn(),
  results: [] as typeof mockResults,
  loading: false,
  error: null as string | null,
  clear: vi.fn(),
};

vi.mock("@/hooks/useCitySearch", () => ({
  useCitySearch: () => mockState,
}));

describe("SearchBar", () => {
  beforeEach(() => {
    mockState = {
      query: "",
      setQuery: vi.fn(),
      results: [],
      loading: false,
      error: null,
      clear: vi.fn(),
    };
  });

  it("renders input with placeholder", () => {
    render(<SearchBar onCityPick={vi.fn()} />);
    expect(screen.getByPlaceholderText("Search for a city...")).toBeInTheDocument();
  });

  it("has correct ARIA combobox attributes on input", () => {
    render(<SearchBar onCityPick={vi.fn()} />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("aria-haspopup", "listbox");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("shows results dropdown when typing", async () => {
    const user = userEvent.setup();
    mockState.results = mockResults;
    mockState.query = "Os";

    render(<SearchBar onCityPick={vi.fn()} />);
    const input = screen.getByRole("combobox");

    // Type to trigger dropdown
    await user.type(input, "Os");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("calls onCityPick when result is clicked", async () => {
    const user = userEvent.setup();
    const onCityPick = vi.fn();
    mockState.results = mockResults;
    mockState.query = "Os";

    render(<SearchBar onCityPick={onCityPick} />);
    await user.type(screen.getByRole("combobox"), "Os");
    await user.click(screen.getAllByRole("option")[0]);

    expect(onCityPick).toHaveBeenCalledWith(mockResults[0]);
  });

  it("has accessible label", () => {
    render(<SearchBar onCityPick={vi.fn()} />);
    expect(screen.getByLabelText("Search for a city")).toBeInTheDocument();
  });
});
