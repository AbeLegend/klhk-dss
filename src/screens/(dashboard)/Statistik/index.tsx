"use client";
// lib
import dynamic from "next/dynamic";
import { FC, useEffect, useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { Props as ChartProps } from "react-apexcharts";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// local
import { CardScreen, Navbar } from "@/components/templates";
import {
  Button,
  ContainerChart,
  ContainerCharts,
  Dropdown,
} from "@/components/atoms";
import { formatDate, formatNumber, OptionsType } from "@/lib";
import {
  getAPICityAll,
  getAPIProvinceAll,
  getAPITahunAll,
  getAPITutupanLahanAll,
  postAPIRekalkulasiStatistic,
} from "@/api/responses";

// type
import {
  CityDataProps,
  DashboardScreenProps,
  dataType,
  initCityData,
  initIsLoading,
  initSelectedCity,
  initSelectedProvince,
  initSelectedTahun,
  initSelectedTutupanLahan,
  IsLoadingProps,
  SelectedCityProps,
  SelectedProvinceProps,
  SelectedTahunProps,
  SelectedTutupanLahanProps,
} from "./type";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hook";

export const DashboardStatistikScreen: FC<DashboardScreenProps> = () => {
  // usePermissions
  usePermissions({
    hasPermission: "Pages.Statistik",
    redirect: "/map-interaktif",
  });

  // variable
  const currentDate = formatDate(new Date(), "dddd, D MMMM YYYY");
  const barHeight = 10;
  const padding = 250;
  // useRouter
  const router = useRouter();
  // useState - loading
  const [isLoading, setIsLoading] = useState<IsLoadingProps>(initIsLoading);
  // useState - dropdown
  const [provinceData, setProvinceData] = useState<OptionsType[]>([]);
  const [selectedProvince, setSelectedProvince] =
    useState<SelectedProvinceProps>(initSelectedProvince);
  const [tahunData, settahunData] = useState<OptionsType[]>([]);
  const [selectedTahun, setSelectedTahun] =
    useState<SelectedTahunProps>(initSelectedTahun);
  const [cityData, setcityData] = useState<CityDataProps>(initCityData);
  const [selectedCity, setSelectedCity] =
    useState<SelectedCityProps>(initSelectedCity);
  const [penutupanLahanData, setpenutupanLahanData] = useState<OptionsType[]>(
    []
  );
  const [selectedTutupanLahan, setSelectedTutupanLahan] =
    useState<SelectedTutupanLahanProps>(initSelectedTutupanLahan);
  // useState - isFirst
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  // useState - data
  const [rekalkulasi, setRekalkulasi] = useState<ChartProps>({
    options: {
      chart: {
        type: "bar",
        id: "rekalkulasi-chart",
        height: 200,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          barHeight: barHeight,
          // columnWidth: 5,
          borderRadius: 2,
          borderRadiusApplication: "end",
          horizontal: true,
          distributed: true,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#000"],
        },
        // background: {
        //   enabled: true,
        //   foreColor: "#fff",
        //   borderRadius: 2,
        //   padding: 0.5,
        //   opacity: 0.5,
        //   borderWidth: 1,
        //   borderColor: "#fff",
        // },
        offsetX: 20,
        formatter: (val) => {
          if (typeof val === "number") {
            return formatNumber(val);
          }
          return val.toString();
        },
      },
      legend: {
        show: false,
      },
      yaxis: {
        title: {
          text: "",
          style: {
            color: "#4B5563",
            cssClass: "inter-font",
            fontWeight: 400,
            fontSize: "16px",
          },
          offsetX: 30,
          offsetY: 30,
        },
        labels: {
          style: {
            colors: "#4B5563",
            cssClass: "inter-font",
            fontWeight: 400,
            fontSize: "12px",
          },
          formatter: (val) => val.toString(),
        },
      },
      xaxis: {
        categories: [],
        // max: 100000000,
        labels: {
          style: {
            colors: "#111618",
            cssClass: "inter-font",
            fontWeight: 400,
            fontSize: "12px",
          },
          formatter: (val) => formatNumber(parseFloat(val)),
        },
      },
      tooltip: {
        y: {
          formatter: (val) => formatNumber(val),
        },
      },
    },
    series: [],
  });
  const [serial, setSerial] = useState<ChartProps>({
    options: {
      chart: {
        type: "bar",
        id: "serial-chart",
        stacked: true,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "last",
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      xaxis: {
        type: "datetime",
        categories: [
          "01/01/2011 GMT",
          "01/02/2011 GMT",
          "01/03/2011 GMT",
          "01/04/2011 GMT",
          "01/05/2011 GMT",
          "01/06/2011 GMT",
        ],
      },
      legend: {
        position: "right",
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    },
    series: [
      {
        name: "PRODUCT A",
        data: [44, 55, 41, 67, 22, 43],
      },
      {
        name: "PRODUCT B",
        data: [13, 23, 20, 8, 13, 27],
      },
      {
        name: "PRODUCT C",
        data: [11, 17, 15, 15, 21, 14],
      },
      {
        name: "PRODUCT D",
        data: [21, 7, 25, 13, 22, 8],
      },
    ],
  });
  const [sankey, setSankey] = useState<ChartProps>({
    options: {
      chart: {
        // type:""
        toolbar: {
          show: false,
        },
      },
    },
  });
  // variable
  const chartHeight =
    rekalkulasi.options && rekalkulasi.options.xaxis
      ? rekalkulasi.options.xaxis.categories.length * barHeight + padding
      : 200;

  // loadData - dropdown
  const loadProvinsi = async () => {
    setIsLoading((value) => ({ ...value, province: true }));
    try {
      const { data, status } = await getAPIProvinceAll();
      if (status === 200) {
        const optionValue: OptionsType[] = data.Data.map((item) => {
          return { label: item.Name, value: item.Id.toString() };
        });
        setProvinceData(optionValue);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading((value) => ({ ...value, province: false }));
    }
  };
  const loadTahun = async () => {
    setIsLoading((value) => ({ ...value, tahun: true }));
    try {
      const { data, status } = await getAPITahunAll({ tahunType: "0" });
      if (status === 200) {
        const optionValue: OptionsType[] = data.Data.map((item) => {
          return { label: item.Year.toString(), value: item.Year.toString() };
        });
        settahunData(optionValue);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading((value) => ({ ...value, tahun: false }));
    }
  };
  const loadCity = async (id: string, type: dataType) => {
    setIsLoading((value) => ({ ...value, city: true }));
    try {
      const { data, status } = await getAPICityAll(id);
      if (status === 200) {
        const optionValue: OptionsType[] = data.Data.map((item) => {
          return { label: item.Name, value: item.Id.toString() };
        });
        if (type === "rekalkulasi") {
          setcityData((value) => ({ ...value, rekalkulasi: optionValue }));
        }
        if (type === "serial") {
          setcityData((value) => ({ ...value, serial: optionValue }));
        }
        if (type === "sankey") {
          setcityData((value) => ({ ...value, sankey: optionValue }));
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading((value) => ({ ...value, city: false }));
    }
  };
  const loadPenutupanLahan = async () => {
    setIsLoading((value) => ({ ...value, penutupanLahan: true }));
    try {
      const { data, status } = await getAPITutupanLahanAll();
      if (status === 200) {
        const optionValue: OptionsType[] = data.Data.map((item) => {
          return { label: item.Name, value: item.Id.toString() };
        });
        setpenutupanLahanData(optionValue);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading((value) => ({ ...value, penutupanLahan: false }));
    }
  };
  // loadData - chart
  const loadRekalkulasi = async () => {
    setIsLoading((value) => ({ ...value, rekalkulasi: true }));
    try {
      let formData: {
        Tahun: string | null;
        IdProvince: string | null;
        IdCity: string | null;
        IdTutupanLahan: string | null;
      } = {
        Tahun: null,
        IdProvince: null,
        IdCity: null,
        IdTutupanLahan: null,
      };
      if (selectedTahun.rekalkulasi) formData.Tahun = selectedTahun.rekalkulasi;
      if (selectedProvince.rekalkulasi)
        formData.IdProvince = selectedProvince.rekalkulasi;
      if (selectedCity.rekalkulasi) formData.IdCity = selectedCity.rekalkulasi;
      if (selectedTutupanLahan.rekalkulasi)
        formData.IdTutupanLahan = selectedTutupanLahan.rekalkulasi;

      const { data, status } = await postAPIRekalkulasiStatistic({
        Tahun: formData.Tahun,
        IdProvince: formData.IdProvince,
        IdCity: formData.IdCity,
        IdTutupanLahan: formData.IdTutupanLahan,
      });

      if (status === 200) {
        const legendData = data.Data.Info.Legend.map((item) => item.Tutupan);
        const valueData = data.Data.Info.Legend.map((item) =>
          Number(item.Value)
        );

        // Map legend to corresponding colors from the API Color array
        const colorsMap = new Map(
          data.Data.Color.map(({ Tutupan, Value }) => [Tutupan, Value])
        );
        const colors = legendData.map(
          (tutupan) => colorsMap.get(tutupan) || "#000000"
        ); // Default to black if color not found

        setRekalkulasi((value) => ({
          ...value,
          series: [
            {
              data: valueData,
              name: "data",
            },
          ],
          options: {
            ...value.options,
            colors,
            xaxis: {
              ...(Array.isArray(value.options?.xaxis)
                ? value.options.xaxis[0]
                : value.options?.xaxis),
              categories: legendData,
              max: Math.max(...valueData) * 1.2,
              min: 0,
            },
            yaxis: {
              ...(Array.isArray(value.options?.yaxis)
                ? value.options.yaxis[0]
                : value.options?.yaxis),
              title: {
                ...(Array.isArray(value.options?.yaxis)
                  ? value.options?.yaxis[0]?.title
                  : value.options?.yaxis?.title),
                text: `Penutupan Lahan (Tahun : ${
                  selectedTahun.rekalkulasi ?? ""
                })`,
              },
            },
          },
        }));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading((value) => ({ ...value, rekalkulasi: false }));
      if (isFirstLoad) setIsFirstLoad(false);
    }
  };

  // handle
  const handleChangeProvince = (value: string, type: dataType) => {
    if (type === "rekalkulasi") {
      setSelectedProvince((oldValue) => ({ ...oldValue, rekalkulasi: value }));
      setSelectedCity((oldValue) => ({ ...oldValue, rekalkulasi: null }));
      loadCity(value, type);
    }
    if (type === "serial") {
      setSelectedProvince((oldValue) => ({
        ...oldValue,
        serial: value,
      }));
      setSelectedCity((oldValue) => ({ ...oldValue, serial: null }));
      loadCity(value, type);
    }
    if (type === "sankey") {
      setSelectedProvince((oldValue) => ({
        ...oldValue,
        sankey: value,
      }));
      setSelectedCity((oldValue) => ({ ...oldValue, sankey: null }));
      loadCity(value, type);
    }
  };
  const handleChangeTahun = (value: string, type: dataType) => {
    if (type === "rekalkulasi") {
      setSelectedTahun((oldValue) => ({ ...oldValue, rekalkulasi: value }));
    }
    if (type === "serial") {
      setSelectedTahun((oldValue) => ({ ...oldValue, serial: value }));
    }
    if (type === "sankey") {
      setSelectedTahun((oldValue) => ({ ...oldValue, sankey: value }));
    }
  };
  const handleChangeCity = (value: string, type: dataType) => {
    if (type === "rekalkulasi") {
      setSelectedCity((oldValue) => ({ ...oldValue, rekalkulasi: value }));
    }
    if (type === "serial") {
      setSelectedCity((oldValue) => ({ ...oldValue, serial: value }));
    }
    if (type === "sankey") {
      setSelectedCity((oldValue) => ({ ...oldValue, sankey: value }));
    }
  };
  const handleChangeTutupanLahan = (value: string, type: dataType) => {
    if (type === "rekalkulasi") {
      setSelectedTutupanLahan((oldValue) => ({
        ...oldValue,
        rekalkulasi: value,
      }));
    }
    if (type === "serial") {
      setSelectedTutupanLahan((oldValue) => ({ ...oldValue, serial: value }));
    }
    if (type === "sankey") {
      setSelectedTutupanLahan((oldValue) => ({ ...oldValue, sankey: value }));
    }
  };

  // useEffect
  useEffect(() => {
    loadProvinsi();
    loadTahun();
    loadPenutupanLahan();
  }, []);

  useEffect(() => {
    if (isFirstLoad && selectedTahun.rekalkulasi !== null) {
      loadRekalkulasi();
    }
  }, [isFirstLoad, selectedTahun.rekalkulasi]);

  return (
    <div>
      <Navbar />
      <CardScreen
        textLeft="Statistik Dashboard B"
        textRight={currentDate}
        childrenClassName="grid gap-y-6"
      >
        {/* Rekalkulasi Penutupan Lahan */}
        <ContainerCharts className="grid grid-cols-12 gap-x-4">
          <div className="col-span-11 grid grid-cols-12 gap-x-4 self-end">
            <div className="col-span-3 w-full">
              <Dropdown
                label="Provinsi"
                title="Pilih Provinsi"
                items={provinceData}
                onSelect={(selected) =>
                  handleChangeProvince(selected[0].value, "rekalkulasi")
                }
              />
            </div>
            <div className="col-span-3 w-full">
              <Dropdown
                label="Tahun"
                title="Pilih Tahun"
                items={tahunData}
                autoSelectFirstItem={true}
                onSelect={(selected) =>
                  handleChangeTahun(selected[0].value, "rekalkulasi")
                }
              />
            </div>
            <div className="col-span-3 w-full">
              <Dropdown
                loading={isLoading.city}
                disabled={cityData.rekalkulasi.length === 0}
                label="Kabupaten / Kota"
                title="Pilih Kabupaten / Kota"
                items={cityData.rekalkulasi}
                onSelect={(selected) =>
                  handleChangeCity(selected[0].value, "rekalkulasi")
                }
              />
            </div>
            <div className="col-span-3 w-full">
              <Dropdown
                label="Penutupan Lahan"
                title="Pilih Penutupan Lahan"
                items={penutupanLahanData}
                onSelect={(selected) =>
                  handleChangeTutupanLahan(selected[0].value, "rekalkulasi")
                }
              />
            </div>
          </div>
          <div className="col-span-1 w-full self-end">
            <Button
              label="Terapkan"
              labelClassName="text-body-2"
              className="w-full justify-center border border-transparent"
              variant="primary-destructive"
              size="xl"
              onClick={() => loadRekalkulasi()}
            />
          </div>
          <ContainerChart className="col-span-12 mt-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-body-1 text-gray-800 font-semibold">
                Rekalkulasi Penutupan Lahan
              </p>
              <div className="flex items-center gap-x-4">
                <Button
                  label="Download ke PDF"
                  variant="outline"
                  iconLeft={<HiOutlineDownload />}
                />
                <Button
                  label="Download ke PNG"
                  variant="outline"
                  iconLeft={<HiOutlineDownload />}
                />
              </div>
            </div>
            <div>
              {rekalkulasi.series && rekalkulasi.series.length > 0 && (
                <Chart
                  options={rekalkulasi.options}
                  series={rekalkulasi.series}
                  type="bar"
                  height={chartHeight}
                />
              )}
            </div>
          </ContainerChart>
        </ContainerCharts>
        {/* Serial Penutupan Lahan */}
        <ContainerCharts className="grid grid-cols-12 gap-x-4">
          <div className="col-span-11 grid grid-cols-12 gap-x-4">
            <div className="col-span-4 w-full">
              <Dropdown
                label="Provinsi"
                title="Pilih Provinsi"
                items={[
                  { label: "tes", value: "tes" },
                  { label: "tes2", value: "tes2" },
                  { label: "tes3", value: "tes3" },
                  { label: "tes4", value: "tes4" },
                  { label: "tes5", value: "tes5" },
                  { label: "tes6", value: "tes6" },
                  { label: "tes7", value: "tes7" },
                  { label: "tes8", value: "tes8" },
                ]}
              />
            </div>
            <div className="col-span-4 w-full">
              <Dropdown
                label="Kabupaten / Kota"
                title="Pilih Kabupaten / Kota"
                items={[
                  { label: "tes", value: "tes" },
                  { label: "tes2", value: "tes2" },
                  { label: "tes3", value: "tes3" },
                  { label: "tes4", value: "tes4" },
                  { label: "tes5", value: "tes5" },
                  { label: "tes6", value: "tes6" },
                  { label: "tes7", value: "tes7" },
                  { label: "tes8", value: "tes8" },
                ]}
              />
            </div>
            <div className="col-span-4 w-full">
              <Dropdown
                label="Penutupan Lahan"
                title="Pilih Penutupan Lahan"
                items={[
                  { label: "tes", value: "tes" },
                  { label: "tes2", value: "tes2" },
                  { label: "tes3", value: "tes3" },
                  { label: "tes4", value: "tes4" },
                  { label: "tes5", value: "tes5" },
                  { label: "tes6", value: "tes6" },
                  { label: "tes7", value: "tes7" },
                  { label: "tes8", value: "tes8" },
                ]}
              />
            </div>
          </div>
          <div className="col-span-1 w-full self-end">
            <Button
              label="Terapkan"
              labelClassName="text-body-2"
              className="w-full justify-center border border-transparent"
              variant="primary-destructive"
              size="xl"
            />
          </div>

          <ContainerChart className="col-span-12 mt-6">
            <div className="flex justify-between items-center">
              <p className="text-body-1 text-gray-800 font-semibold">
                Serial Penutupan Lahan
              </p>
              <div className="flex items-center gap-x-4">
                <Button
                  label="Download ke PDF"
                  variant="outline"
                  iconLeft={<HiOutlineDownload />}
                />
                <Button
                  label="Download ke PNG"
                  variant="outline"
                  iconLeft={<HiOutlineDownload />}
                />
              </div>
            </div>
            <div>
              <Chart
                options={serial.options}
                series={serial.series}
                type="bar"
                height={350}
              />
            </div>
          </ContainerChart>
        </ContainerCharts>
        {/*  */}
        <ContainerCharts className="grid grid-cols-12 gap-x-4">
          <div className="col-span-11 grid grid-cols-12 gap-x-4">
            <div className="col-span-4 w-full">
              <Dropdown
                label="Provinsi"
                title="Pilih Provinsi"
                items={[
                  { label: "tes", value: "tes" },
                  { label: "tes2", value: "tes2" },
                  { label: "tes3", value: "tes3" },
                  { label: "tes4", value: "tes4" },
                  { label: "tes5", value: "tes5" },
                  { label: "tes6", value: "tes6" },
                  { label: "tes7", value: "tes7" },
                  { label: "tes8", value: "tes8" },
                ]}
              />
            </div>
            <div className="col-span-4 w-full">
              <Dropdown
                label="Kabupaten / Kota"
                title="Pilih Kabupaten / Kota"
                items={[
                  { label: "tes", value: "tes" },
                  { label: "tes2", value: "tes2" },
                  { label: "tes3", value: "tes3" },
                  { label: "tes4", value: "tes4" },
                  { label: "tes5", value: "tes5" },
                  { label: "tes6", value: "tes6" },
                  { label: "tes7", value: "tes7" },
                  { label: "tes8", value: "tes8" },
                ]}
              />
            </div>
            <div className="col-span-4 w-full">
              <Dropdown
                label="Penutupan Lahan"
                title="Pilih Penutupan Lahan"
                items={[
                  { label: "tes", value: "tes" },
                  { label: "tes2", value: "tes2" },
                  { label: "tes3", value: "tes3" },
                  { label: "tes4", value: "tes4" },
                  { label: "tes5", value: "tes5" },
                  { label: "tes6", value: "tes6" },
                  { label: "tes7", value: "tes7" },
                  { label: "tes8", value: "tes8" },
                ]}
              />
            </div>
          </div>
          <div className="col-span-1 w-full self-end">
            <Button
              label="Terapkan"
              labelClassName="text-body-2"
              className="w-full justify-center border border-transparent"
              variant="primary-destructive"
              size="xl"
            />
          </div>

          <ContainerChart className="col-span-12 mt-6">
            <div className="flex justify-between items-center">
              <p className="text-body-1 text-gray-800 font-semibold">.</p>
              <div className="flex items-center gap-x-4">
                <Button
                  label="Download ke PDF"
                  variant="outline"
                  iconLeft={<HiOutlineDownload />}
                />
                <Button
                  label="Download ke PNG"
                  variant="outline"
                  iconLeft={<HiOutlineDownload />}
                />
              </div>
            </div>
          </ContainerChart>
        </ContainerCharts>
      </CardScreen>
    </div>
  );
};
