import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  socialLoading: false,
  participantsLoading: false,
  replaceLoading: false,
  ETALoading: false,
  YTCommentsList: [],
  YTData: {},
  setting: {
    title: '',
    winnerCount: 1,
    substitudesCount: 0,
    excludeDuplicates: false,
    filterByHashTag: false,
    hashTags: '',
    extraChances: '',
    bonusExtraChances: false,
    blockListNames: '',
    blockList: false,
    countDown: 5,
  },
  brandImage: '',
  winnerList: {},
  videoUrlAfter: '',
  colorClass: {
    r: 255,
    g: 255,
    b: 255,
  },
  certificateData: {},
  allCertificateList: {},
  allCommentersList: [],
};

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    setSocialLoading: (state, action) => {
      state.socialLoading = action.payload;
    },
    setParticipantsLoading: (state, action) => {
      state.participantsLoading = action.payload;
    },
    setETALoading: (state, action) => {
      state.ETALoading = action.payload;
    },
    setYTCommentsList: (state, action) => {
      state.YTCommentsList = action.payload;
    },
    setYTData: (state, action) => {
      state.YTData = action.payload;
    },
    setSettings: (state, action) => {
      state.setting = action.payload;
    },
    setBrandImage: (state, action) => {
      state.brandImage = action.payload;
    },
    clearSettings: state => {
      state.setting = initialState.setting;
    },
    setWinnersList: (state, action) => {
      state.winnerList = action.payload;
    },
    setColorClass: (state, action) => {
      state.colorClass = action.payload;
    },
    setVideoUrlAfter: (state, action) => {
      state.videoUrlAfter = action.payload;
    },
    setCertificateData: (state, action) => {
      state.certificateData = action.payload;
    },
    setReplaceLoading: (state, action) => {
      state.replaceLoading = action.payload;
    },
    setAllCertificateList: (state, action) => {
      state.allCertificateList = action.payload;
    },
    setAllCommentersList: (state, action) => {
      state.allCommentersList = action.payload;
    },
    resetSocialSlice: () => initialState,
  },
});

export const {
  setSocialLoading,
  setETALoading,
  setYTCommentsList,
  setYTData,
  resetSocialSlice,
  setSettings,
  clearSettings,
  setBrandImage,
  setWinnersList,
  setParticipantsLoading,
  setColorClass,
  setVideoUrlAfter,
  setCertificateData,
  setReplaceLoading,
  setAllCertificateList,
  setAllCommentersList,
} = socialSlice.actions;

export default socialSlice.reducer;
