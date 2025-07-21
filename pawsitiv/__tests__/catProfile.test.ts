import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CatProfilePage from "../src/app/catProfile/page";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) =>
    React.createElement("img", {
      src,
      alt,
      width,
      height,
      className,
    }),
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to avoid noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("CatProfilePage", () => {
  const mockCatData = {
    name: "CHONKUS MAXIMUS in Chania",
    age: 3,
    mood: "Happy",
    hungry: "Not hungry",
    description: "A playful and friendly cat who loves to chase toys.",
    imageUrl: "/img/lickingCat.webp",
  };

  it("renders cat profile with data successfully", async () => {
    // Mock successful fetch response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCatData,
    });

    render(React.createElement(CatProfilePage));

    // Wait for the component to load
    await waitFor(() => {
      expect(
        screen.getByText("CHONKUS MAXIMUS in Chania's Profile")
      ).toBeInTheDocument();
    });

    // Check that all cat information is displayed
    expect(
      screen.getByText("Name: CHONKUS MAXIMUS in Chania")
    ).toBeInTheDocument();
    expect(screen.getByText("Age: 3 years old")).toBeInTheDocument();
    expect(screen.getByText("Mood: Happy")).toBeInTheDocument();
    expect(screen.getByText("Hungry: Not hungry")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Description: A playful and friendly cat who loves to chase toys."
      )
    ).toBeInTheDocument();

    // Check that the image is rendered
    const catImage = screen.getByAltText(
      "Picture of CHONKUS MAXIMUS in Chania"
    );
    expect(catImage).toBeInTheDocument();
    expect(catImage).toHaveAttribute("src", "/img/lickingCat.webp");
  });

  it("displays error message when fetch fails", async () => {
    // Mock failed fetch response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    render(React.createElement(CatProfilePage));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText("Cat Profile Not Found")).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        "Could not load the cat's profile. Please try again later."
      )
    ).toBeInTheDocument();
  });

  it("displays error message when fetch throws an error", async () => {
    // Mock fetch to throw an error
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    render(React.createElement(CatProfilePage));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText("Cat Profile Not Found")).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        "Could not load the cat's profile. Please try again later."
      )
    ).toBeInTheDocument();
  });

  it("calls fetch with correct URL", async () => {
    // Mock successful fetch response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCatData,
    });

    render(React.createElement(CatProfilePage));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3669/api/cats/catProfile",
        { cache: "no-store" }
      );
    });
  });

  it("handles different cat data correctly", async () => {
    const differentCatData = {
      name: "Cloud Strife",
      age: 5,
      mood: "Sleepy",
      hungry: "Very hungry",
      description: "A lazy cat who loves to nap all day.",
      imageUrl: "/img/sleepingCat.webp",
    };

    // Mock successful fetch response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => differentCatData,
    });

    render(React.createElement(CatProfilePage));

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText("Cloud Strife's Profile")).toBeInTheDocument();
    });

    // Check that all cat information is displayed correctly
    expect(screen.getByText("Name: Cloud Strife")).toBeInTheDocument();
    expect(screen.getByText("Age: 5 years old")).toBeInTheDocument();
    expect(screen.getByText("Mood: Sleepy")).toBeInTheDocument();
    expect(screen.getByText("Hungry: Very hungry")).toBeInTheDocument();
    expect(
      screen.getByText("Description: A lazy cat who loves to nap all day.")
    ).toBeInTheDocument();

    // Check that the image is rendered with correct attributes
    const catImage = screen.getByAltText("Picture of Cloud Strife");
    expect(catImage).toBeInTheDocument();
    expect(catImage).toHaveAttribute("src", "/img/sleepingCat.webp");
    expect(catImage).toHaveAttribute("width", "400");
    expect(catImage).toHaveAttribute("height", "300");
  });

  it("has correct styling classes", async () => {
    // Mock successful fetch response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCatData,
    });

    render(React.createElement(CatProfilePage));

    await waitFor(() => {
      expect(
        screen.getByText("CHONKUS MAXIMUS in Chania's Profile")
      ).toBeInTheDocument();
    });

    // Check that the main container has the expected classes
    const mainContainer = screen
      .getByText("CHONKUS MAXIMUS in Chania's Profile")
      .closest("div");
    expect(mainContainer).toHaveClass(
      "bg-white",
      "rounded-xl",
      "shadow-lg",
      "p-8",
      "mt-8",
      "max-w-2xl",
      "mx-auto"
    );

    // Check that the title has the expected classes
    const title = screen.getByText("CHONKUS MAXIMUS in Chania's Profile");
    expect(title).toHaveClass(
      "text-4xl",
      "font-bold",
      "text-purple-700",
      "mb-6",
      "text-center"
    );

    // Check that the image has the expected classes
    const catImage = screen.getByAltText(
      "Picture of CHONKUS MAXIMUS in Chania"
    );
    expect(catImage).toHaveClass(
      "rounded-lg",
      "shadow-md",
      "border-4",
      "border-purple-200"
    );
  });
});
