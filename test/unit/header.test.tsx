// @ts-nocheck
import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { initStore } from "../../src/client/store";
import { Application } from "../../src/client/Application";
import { Provider } from "react-redux";
import { CartApiStub, ExampleApiStub } from "./stub/api";

import { it, expect } from "@jest/globals";
import { MemoryRouter } from "react-router";

describe("Шапка", () => {
  it("название магазина в шапке должно быть ссылкой на главную страницу", async () => {
    const exampleApi = new ExampleApiStub();
    const cartApi = new CartApiStub();

    const store = initStore(exampleApi, cartApi);

    const application = (
      <>
        <MemoryRouter initialEntries={[`/`]}>
          <Provider store={store}>
            <Application />
          </Provider>
        </MemoryRouter>
      </>
    );

    const { getAllByRole } = render(application);
    const homeLink = getAllByRole("link").find(
      (element) => element.textContent === "Example store"
    );
    expect(homeLink?.getAttribute("href")).toBe("/");
  });
});
