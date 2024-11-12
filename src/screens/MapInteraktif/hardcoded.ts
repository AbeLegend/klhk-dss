export const hardcoded = [
  {
    groupTitle: "Deteksi Perencanaan & Pengelolaan",
    data: null,
  },
  {
    groupTitle: "Laju Perubahan",
    data: null,
  },
  {
    groupTitle: "Alur & Status Tahapan",
    data: {
      jenisInformasi: [
        "Persetujuan",
        "Daya Dukung & Tampung",
        "Amdal",
        "UKL-UPL",
        "Permohonan",
        "Pengukuhan, Penetapan & Pelepasan",
      ],
      // Persetujuan
      persetujuan: {
        tab: [
          "PPHTR",
          "PPHD",
          "PKK",
          "PPKHN",
          "PPKH Eksplorasi",
          "Non Tambang",
        ],
        PPHTR: {
          title: "Persetujuan Pengelolaan Hutan Tanaman Rakyat (PPHTR)",
          data1: [
            {
              title: "Nama",
              value: "KTH AEK NATONGGI",
            },
            {
              title: "No.SK",
              value: "No.SK",
            },
          ],
          data2: [
            {
              title: "Tanggal SK",
              value: "02/02/2024",
            },
            {
              title: "Luas",
              value: "500.64 Ha",
            },
          ],
        },
        PPHD: {
          title: "Persetujuan Pengelolaan Hutan Desa (PPHD)",
          data1: [
            {
              title: "Nama Lembaga",
              value: "LPHD BANTAN AIR",
            },
            {
              title: "Luas",
              value: "522.614/2024",
            },
          ],
        },
        PKK: {
          title: "Persetujuan Kemitraan Kehutanan (PKK)",
          data1: [
            {
              title: "Nama Kelompok",
              value: "KTH Batu berdiri",
            },
            {
              title: "Nama Pemegang",
              value: "522.614/2024",
            },
          ],
          data2: [
            {
              title: "No SK",
              value: "SK.6466/MELHKPSKL/PKPS/PSL.0/8/2022",
            },
            {
              title: "Tanggal SK",
              value: "12/02/2022",
            },
            {
              title: "Luas",
              value: "345,44 Ha",
            },
          ],
        },
        PPKHN: {
          title:
            "Pengelolaan Pembangunan Kehutanan dan Lingkungan Hidup (PPKHN)",
          data1: [
            {
              title: "Nama Unit",
              value: "Woyla Aceh Mineral, PT",
            },
            {
              title: "No SK",
              value: "522.614/2024",
            },
          ],
          data2: [
            {
              title: "Tanggal SK",
              value: "06/09/2022",
            },
            {
              title: "Luas",
              value: "559,31 Ha",
            },
          ],
        },
        PPKHEksporasi: {
          title: "Persetujuan Penggunaan Kawasan Hutan Eksplorasi",
          data1: [
            {
              title: "Nama Unit",
              value: "Woyla Aceh Mineral, PT",
            },
            {
              title: "No SK",
              value: "522.614/2024",
            },
          ],
          data2: [
            {
              title: "Tanggal SK",
              value: "06/09/2022",
            },
            {
              title: "Luas",
              value: "559,31 Ha",
            },
          ],
        },
        NonTambang: {
          title:
            "Persetujuan Penggunaan Kawasan Hutan Operasi Produksi/Non Tambang",
          data1: [
            {
              title: "Nama Unit",
              value: "PLN (Persero), PT",
            },
            {
              title: "No SK",
              value: "522.614/2024",
            },
          ],
          data2: [
            {
              title: "Tanggal SK",
              value: "06/09/2022",
            },
            {
              title: "Luas",
              value: "559,31 Ha",
            },
          ],
        },
      },
      // Daya Dukung & Tampung
      dayaDukungDanTampung: {
        dayaDukung: {
          title: "Daya Dukung",
          data1: [
            {
              title: "Nama Unit",
              value: "CA Batukahu III",
            },
            {
              title: "Penunjukan",
              value: "433/Kpts-IV/1999 15 Juni 1999",
            },
          ],
          data2: [
            {
              title: "SK Penetapan",
              value: "SK.2847/Menhut-VII/KUH/2014 16 April 2014",
            },
          ],
        },
        dayaTampung: {
          title: "Daya Tampung",
          data1: [
            {
              title: "Ketersediaan Air",
              value: "287,120.90",
            },
            {
              title: "Kebutuhan Air Domistik",
              value: "0",
            },
          ],
          data2: [
            {
              title: "Kebutuhan Air untuk Lahan",
              value: "0",
            },
            {
              title: "Ambang Batas Populasi",
              value: "359",
            },
            {
              title: "Status",
              value: "Terlampaui",
            },
          ],
        },
      },
      // Amdal
      amdal: {
        amdal: {
          title: "Analisis Mengenai Dampak Lingkungan (AMDAL)",
          data1: [
            {
              title: "Nama Unit",
              value: "PT Antam Tbk",
            },
            {
              title: "SK",
              value: "433/Kpts-IV/1999 15 Juni 1999",
            },
          ],
          data2: [
            {
              title: "Luas",
              value: "500 Ha",
            },
          ],
        },
      },
      // UKL-UPL
      uklUpl: {
        uklUpl: {
          title:
            "Upaya Pengelolaan Lingkungan Hidup & Upaya Pemantauan Lingkungan Hidup (UKL-UPL)",
          data1: [
            {
              title: "Nama Unit",
              value: "PT Antam Tbk",
            },
            {
              title: "SK",
              value: "433/Kpts-IV/1999 15 Juni 1999",
            },
          ],
          data2: [
            {
              title: "Luas",
              value: "500 Ha",
            },
          ],
        },
      },
      // Permohonan
      permohonan: {
        permohonan: {
          title: "Pemohon",
          data1: [
            {
              title: "Nama Pemohon",
              value: "Maulana Ibrahim",
            },
            {
              title: "Jenis Permohonan",
              value: "permohonan Persetujuan penggunaan kawasan hutan",
            },
          ],
          data2: [
            {
              title: "Tanggal Permohonan",
              value: "20 Oktober 2024",
            },
            {
              title: "No SK",
              value: "SK.203/2901",
            },
          ],
          data3: [
            {
              title: "Status Permohonan",
              value: "Disetujui",
            },
          ],
        },
      },
      // Pengukuhan, Penetapan & Pelepasan
      pengukuhanPenetapanDanPelepasan: {
        penetapan: {
          title: "Penetapan",
          data1: [
            {
              title: "Nama",
              value: "PT Antam Tbk",
            },
            {
              title: "Penetapan",
              value: "dbkhk.pktl_ppkh.PNTPNKWSHUTAN_AR_50_K_042023",
            },
            {
              title: "No.SK",
              value: "SK.203/2901",
            },
          ],
          data2: [
            {
              title: "Tanggal SK Kawasan Hutan",
              value: "12/02/2024",
            },
            {
              title: "Kab/Kota",
              value: "Kalimalang",
            },
          ],
        },
        pengukuhan: {
          title: "Pengukuhan",
          data1: [
            {
              title: "Nama",
              value: "PT Antam Tbk",
            },
            {
              title: "Penetapan",
              value: "dbkhk.pktl_ppkh.PNTPNKWSHUTAN_AR_50_K_042023",
            },
            {
              title: "No.SK",
              value: "SK.203/2901",
            },
          ],
          data2: [
            {
              title: "Tanggal SK Kawasan Hutan",
              value: "12/02/2024",
            },
            {
              title: "Kab/Kota",
              value: "Kalimalang",
            },
          ],
        },
        pelepasan: {
          title: "Pelepasan",
          data1: [
            {
              title: "Nama Pelepasan",
              value: "Hutan Primer",
            },
            {
              title: "No.SK",
              value: "SK.203/2901",
            },
          ],
          data2: [
            {
              title: "Jenis Pelepasan",
              value: "1",
            },
            {
              title: "No.SK",
              value: "SK.203/2901",
            },
          ],
          data3: [
            {
              title: "Tanggal SK.Pelepasan & Surat Penegasan",
              value: "",
            },
            {
              title: "Luas SK & Surat Penegasan",
              value: "",
            },
          ],
        },
      },
    },
  },
  {
    groupTitle: "Evaluasi",
    data: {
      tab: ["Amdal", "UKL-UPL"],
      noTitle: {
        title: "",
        data1: [
          {
            title: "Nama Perusahaan",
            value: "PT Adaro Energy Tbk",
          },
          {
            title: "No Registrasi",
            value: "66F23188B95EA",
          },
        ],
        data2: [
          {
            title: "Penanggung Jawab",
            value: "DRH.JULIUS STIAWAN JO",
          },
          {
            title: "Alamat Email",
            value: "petrotamaiss@gmail.com",
          },
        ],
      },
      dokumen: {
        title: "Dokumen",
        data1: [
          "Surat Kesesuaian Tata Ruang",
          "Peta Tapak Proyek",
          "Dokumen Hasil Penapisan di OSS",
          "Dokumen SPPL dari OSS",
        ],
      },
      statusTracking: {
        title: "Status Tracking",
        data1: [
          {
            title: "Penapisan Otomatis Selesai oleh PT Adaro Enegy Tbk",
            value: "23-01-2024 11:05:28",
          },
          {
            title: "Pembentukan Tim Penyusun",
            value: "23-01-2024 11:05:28",
          },
          {
            title: "Penyusunan Formulir UKL-UPL",
            value: "23-01-2024 11:05:28",
          },
        ],
      },
    },
  },
];