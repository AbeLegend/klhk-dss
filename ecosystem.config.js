module.exports = {
  apps: [
    {
      name: "dss-fe",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      // cwd: "D:\\Project\\2024\\NextJS\\klhk-dss",
      cwd: "C:\\Users\\Administrator\\Documents\\DSS-FE-SC",
      watch: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
