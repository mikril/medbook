import 'dotenv/config';

export default {
  expo: {
    name: "Healthsbase",
    slug: "healthsbase",
    extra: {
      apiUrl: process.env.REACT_APP_API_BASE_URL,
      vadimUrl: process.env.VADIM_NEIRO
    },
  },
};
