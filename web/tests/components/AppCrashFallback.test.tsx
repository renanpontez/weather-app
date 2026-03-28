import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppCrashFallback } from "@/components/common/AppCrashFallback";

function ThrowingChild(): React.ReactNode {
  throw new Error("Test crash");
}

describe("ErrorBoundary", () => {
  // Suppress React error boundary console.error noise
  const original = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = original;
  });

  it("renders children when no error", () => {
    render(
      <AppCrashFallback>
        <p>Content</p>
      </AppCrashFallback>,
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders fallback on error", () => {
    render(
      <AppCrashFallback>
        <ThrowingChild />
      </AppCrashFallback>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("reload button calls window.location.reload", async () => {
    const user = userEvent.setup();
    const reloadMock = vi.fn();
    Object.defineProperty(window, "location", {
      value: { ...window.location, reload: reloadMock },
      writable: true,
    });

    function ThrowOnce(): React.ReactNode {
      throw new Error("crash");
    }

    render(
      <AppCrashFallback>
        <ThrowOnce />
      </AppCrashFallback>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    await user.click(screen.getByText("Reload"));
    expect(reloadMock).toHaveBeenCalled();
  });
});
