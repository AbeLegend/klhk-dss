import { OptionsType } from "@/lib";

// DashboardScreen
export interface DashboardScreenProps { }

// BEGIN: IsLoading
export interface IsLoadingProps {
  // data
  rekalkulasi: boolean;
  serial: boolean;
  sankey: boolean;
  // dropdown
  province: boolean;
  tahun: boolean;
  city: boolean;
  penutupanLahan: boolean;
}

// InitData
export const initIsLoading: IsLoadingProps = {
  // data
  rekalkulasi: false,
  serial: false,
  sankey: false,
  // dropdown
  province: false,
  tahun: false,
  city: false,
  penutupanLahan: false,
};
// END: IsLoading

// BEGIN: SelectedProvince
export interface SelectedProvinceProps {
  rekalkulasi: string | null;
  serial: string | null;
  sankey: string | null;
}

export const initSelectedProvince: SelectedProvinceProps = {
  rekalkulasi: null,
  serial: null,
  sankey: null
};
// END: SelectedProvince

// BEGIN: dataType
export type dataType = "rekalkulasi" | "serial" | "sankey"
// END: dataType


// BEGIN: CityData
export interface CityDataProps {
  rekalkulasi: OptionsType[];
  serial: OptionsType[];
  sankey: OptionsType[];
}

export const initCityData: CityDataProps = {
  rekalkulasi: [],
  serial: [],
  sankey: []
};
// END: CityData

// BEGIN: SelectedCity
export interface SelectedCityProps {
  rekalkulasi: string | null;
  serial: string | null;
  sankey: string | null;
}

export const initSelectedCity: SelectedCityProps = {
  rekalkulasi: null,
  serial: null,
  sankey: null
};
// END: SelectedCity

// BEGIN: SelectedTahun
export interface SelectedTahunProps {
  rekalkulasi: string | null;
  serial: string | null;
  sankey: string | null;
}

export const initSelectedTahun: SelectedTahunProps = {
  rekalkulasi: null,
  serial: null,
  sankey: null
};
// END: SelectedTahun

// BEGIN: SelectedTutupanLahan
export interface SelectedTutupanLahanProps {
  rekalkulasi: string | null;
  serial: string | null;
  sankey: string | null;
}

export const initSelectedTutupanLahan: SelectedTutupanLahanProps = {
  rekalkulasi: null,
  serial: null,
  sankey: null
};
// END: SelectedTutupanLahan