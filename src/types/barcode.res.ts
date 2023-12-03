type BarcodeResponse = {
  langId: string;
  result: BarcodeResultResponse[];
};

type BarcodeResultResponse = {
  data: BarcodeResultDataResponse[];
  source: string;
  method: string;
};

type BarcodeResultDataResponse = {
  pdid: string;
  gtin: string;
  pdname: string;
  pdremark: string | null;
  cmpyname: string;
  imgfile: string;
};
