import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

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

  const res = await fetch(
    `https://www.barcodeplus.com.hk/eid/resource/jsonservice?data=${json}`,
    { cache: "force-cache" }
  );
  const resData = await res.json();
  console.log(`[RD] ${JSON.stringify(resData)}`);
  const data = resData as BarcodeResponse;

  if (data.result[0].data.length == 0) {
    return NextResponse.json(
      { message: `${q} is not found` },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(data.result[0].data[0]);
}
