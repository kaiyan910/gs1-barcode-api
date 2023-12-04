import domExtract from "@/helper/dom.helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json(
      { message: "query parameter `q` is not provided" },
      {
        status: 400,
      }
    );
  }

  const queryParams = {
    appCode: "EIDM",
    method: "getSearchProductInfo",
    gtin: q,
    pdname: q,
    isdraft: "N",
    nonpubind: "1",
    langid: "zh_TW",
  };

  const json = encodeURIComponent(JSON.stringify(queryParams));
  console.log(`[QP] ${json}`);

  const barcodePlusResponse = await fetch(
    `https://www.barcodeplus.com.hk/eid/resource/jsonservice?data=${json}`,
    { cache: "force-cache" }
  );
  const resData = await barcodePlusResponse.json();
  console.log(`[RD] ${JSON.stringify(resData)}`);
  const data = resData as BarcodeResponse;

  if (data.result[0].data.length == 0) {
    const barcodelookupResponse = await fetch(
      `https://www.barcodelookup.com/${q}`,
      {
        cache: "force-cache",
      }
    );

    const rawData = await barcodelookupResponse.text();

    return new NextResponse(rawData, {
      headers: { "content-type": "text/html" },
    });

    /*const domData = domExtract(rawData);

    if (domData) {
      return NextResponse.json(domData);
    } else {
      return NextResponse.json(
        { message: `${q} is not found` },
        {
          status: 404,
        }
      );
    }*/
  }

  return NextResponse.json({
    name: data.result[0].data[0].pdname,
    company: data.result[0].data[0].cmpyname,
    image: data.result[0].data[0].imgfile
      ? `https://www.barcodeplus.com.hk/eid/resource/libx/dfile/gtin:${data.result[0].data[0].imgfile}`
      : null,
  });
}
