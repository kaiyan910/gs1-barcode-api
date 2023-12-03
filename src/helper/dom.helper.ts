import { JSDOM } from "jsdom";

const domExtract = (content: string) => {
  const dom = new JSDOM(content);

  if (
    !dom.window.document.querySelector(
      "#product > section:nth-child(3) > div:nth-child(1) > div > div > div.col-50.product-details"
    )
  ) {
    return null;
  }

  const product = dom.window.document.querySelector(
    "#product > section:nth-child(3) > div:nth-child(1) > div > div > div.col-50.product-details > h4"
  )?.textContent;
  const company = dom.window.document.querySelector(
    "#product > section:nth-child(3) > div:nth-child(1) > div > div > div.col-50.product-details > div:nth-last-child(2) > span"
  )?.textContent;
  const image = dom.window.document
    .querySelector("#largeProductImage > img")
    ?.getAttribute("src");

  return {
    name: product?.trim(),
    company: company?.trim(),
    image,
  };
};

export default domExtract;
