// @ts-nocheck
import { createContext, useContext, useState, useRef } from "react";
import { fabric } from "fabric";
import { saveAs } from "file-saver";
import axios from "axios";
import * as THREE from "three";
import { toast } from "react-toastify";
import { useSession } from "@supabase/auth-helpers-react";
import Pica from "pica";
import { supabase } from "@/utils/supabase";
import { getBase64FromUrl, scaleDownImage } from "@/utils";

type ContextProviderProps = {
  children: React.ReactNode;
};

interface ContextITFC {
  canvasInstance: React.MutableRefObject<null> | null;
  previewBox: React.MutableRefObject<null> | null;
  canvasHistory: React.MutableRefObject<null> | null;
  currentCanvasIndex: React.MutableRefObject<null> | null;
  stageRef: React.MutableRefObject<null> | null;
  PosisionbtnRef: React.MutableRefObject<null> | null;
  regenerateRef: React.MutableRefObject<null> | null;
  generateBtnRef: React.MutableRefObject<null> | null;
  canvasHistoryRef: any | null;
  canvasRef: React.MutableRefObject<null> | null;
  generateBox: React.MutableRefObject<null> | null;
  outerDivRef: React.MutableRefObject<null> | null;
  addimgToCanvas: (url: string) => void;
  addimgToCanvasSubject: (url: string) => void;
  addimgToCanvasGen: (url: string) => void;
  editorBox: fabric.Rect | null;
  setEditorBox: (editorBox: fabric.Rect | null) => void;
  getBase64FromUrl: (url: string) => void;
  activeTab: number | null;
  setActiveTab: (activeTab: number) => void;
  brushSize: number | null;
  setBrushSize: (brushSize: number) => void;
  activeTabHome: number | null;
  setActiveTabHome: (activeTabHome: number) => void;
  selectedImg: object | null;
  setSelectedImg: (selectedImg: object | null) => void;
  downloadImg: string | null;
  setDownloadImg: (downloadImg: string) => void;
  isMagic: boolean | null;
  setIsMagic: (isMagic: boolean) => void;
  loadercarna: boolean | null;
  setloadercarna: (loadercarna: boolean) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  viewMore: object;
  setViewMore: (viewMore: object) => void;
  selectResult: number;
  setSelectedresult: (selectResult: number) => void;
  product: string;
  setProduct: (product: string) => void;
  uploadedProductlist: string[];
  setUploadedProductlist: (uploadedProductlist: string[]) => void;
  generatedImgList: any[];
  setGeneratedImgList: (generatedImgList: any[]) => void;
  previewLoader: boolean;
  setPriviewLoader: (previewLoader: boolean) => void;
  mainLoader: boolean;
  setMainLoader: (mainLoader: boolean) => void;
  generationLoader: boolean;
  setGenerationLoader: (generationLoader: boolean) => void;
  loader: boolean;
  setLoader: (loader: boolean) => void;
  modifidImageArray: string[];
  setModifidImageArray: (modifidImageArray: string[]) => void;
  jobId: string[];
  setJobId: (jobId: string[]) => void;
  jobIdOne: string[];
  setJobIdOne: (jobIdOne: string[]) => void;
  popup: object;
  setPopup: (popup: object) => void;
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
  popupImage: object;
  setPopupImage: (popupImage: object) => void;
  regeneratePopup: object;
  setRegeneratePopup: (regeneratePopup: object) => void;
  removepopu3d: object | boolean;
  setremovepopu3d: (removepopu3d: object | boolean) => void;
  activeTemplet: object | null;
  setActiveTemplet: (activeTemplet: object | null) => void;
  lines: any[];
  setLines: (lines: any[]) => void;
  linesHistory: any[];
  setLinesHistory: (linesHistory: any[]) => void;
  mode: string;
  setMode: (generatedImgList: string) => void;
  regenratedImgsJobId: string | null;
  setRegenratedImgsJobid: (regenratedImgsJobId: string) => void;
  crop: boolean;
  setCrop: React.Dispatch<React.SetStateAction<boolean>>;
  filsizeMorethan10: boolean;
  setfilsizeMorethan10: React.Dispatch<React.SetStateAction<boolean>>;
  canvasDisable: boolean;
  setCanvasDisable: (canvasDisable: boolean) => void;
  assetLoader: boolean;
  setassetLoader: (assetLoader: boolean) => void;
  brandassetLoader: boolean;
  setbrandassetLoader: (brandassetLoader: boolean) => void;
  TDMode: boolean;
  set3dMode: (TDMode: boolean) => void;
  assetL3doader: boolean;
  setasset3dLoader: (assetL3doader: boolean) => void;
  filteredArray: any;
  setFilteredArray: (filteredArray: any) => void;
  regenratingId: any;
  newEditorBox: any;
  setregeneraatingId: (regenratingId: any) => void;
  tdFormate: string;
  setTdFormate: (tdFormate: string) => void;
  promt: string;
  setpromt: (promt: string) => void;
  renderer: THREE.WebGLRenderer | null;
  setRenderer: (renderer: THREE.WebGLRenderer) => void;
  file3dUrl: any;
  setFile3dUrl: (file3dUrl: any) => void;
  category: any | null;
  setcategory: (category: any) => void;
  changeRectangleSize: () => void;
  getSupabaseImage: () => void;
  positionBtn: (obj: any) => void;
  generate3dHandeler: (ueserId: any, proid: any) => void;
  generateImageHandeler: (ueserId: any, proid: any) => void;
  fetchGeneratedImages: (userId: any) => void;
  RegenerateImageHandeler: (ueserId: any) => void;
  handleDownload: (url: string) => void;
  fetchAssetsImagesBrant: (userId: any, pro: any) => void;
  fetchAssetsImagesWithProjectId: (userId: any, pro: any) => void;
  GetProjextById: (getUser: any) => void;
  saveCanvasToDatabase: () => void;
  bringImageToFront: () => void;
  sendImageToBack: () => void;
  renameProject: (userId: any, projectId: any, name: any) => void;
  fetchAssetsImages: (userId: any, pro: any) => void;
  SaveProjexts: (userId: any, projectId: any, canvas: any) => void;
  addtoRecently: (ueserId: any, proid: any) => void;
  GetProjexts: (getUser: string) => void;
  AssetsActivTab: string;
  setassetsActiveTab: (AssetsActivTab: string) => void;
  imageGenRect: any;
  userId: string | null;
  setUserID: (userId: string) => void;
  downloadeImgFormate: string | null;
  setDownloadeImgFormate: (downloadeImgFormate: string) => void;
  promtFull: string | null;
  setpromtFull: (promtFull: string) => void;
  file3d: File | null | string;
  setFile3d: (file3d: File | null | string) => void;
  magickErase: boolean;
  setmagickErase: (magickErase: boolean) => void;
  projectId: string | null;
  setprojectId: (projectId: string) => void;
  zoom: number;
  setZoomCanvas: (zoom: number) => void;
  activeSize: object;
  setActiveSize: React.Dispatch<
    React.SetStateAction<{
      id: number;
      title: string;
      subTittle: string;
      h: number;
      w: number;
      l: number;
      t: number;
      gl: number;
      gt: number;
    }>
  >;

  listofassetsById: any[];
  setListOfAssetsById: (listofassetsById: any[]) => void;
  project: object[];
  setproject: (project: object[]) => void;
  projectlist: object[];
  setprojectlist: (projectlist: object[]) => void;
  templet: object | null;
  setTemplet: (templet: object) => void;
  file3dName: any;
  setFile3dName: (file3dName: any | null) => void;
  listofassetsBarand: any[] | null;
  setListOfAssetsBrand: (listofassetsBarand: any[]) => void;
  listofassets: any | null;
  setListOfAssets: (listofassets: any) => void;
}

export const AppContext = createContext<ContextITFC>({
  activeTab: 1,
  setActiveTab: () => {},
  activeTabHome: 1,
  setActiveTabHome: () => {},
  brushSize: 5,
  setBrushSize: () => {},
  imageGenRect: "",
  selectedImg: null,
  setSelectedImg: () => {},
  fetchAssetsImagesBrant: () => {},
  GetProjextById: () => {},
  SaveProjexts: () => {},
  addtoRecently: () => {},
  renameProject: () => {},
  saveCanvasToDatabase: () => {},
  GetProjexts: () => {},
  downloadImg: null,
  setDownloadImg: () => {},
  isMagic: null,
  setIsMagic: () => {},
  editorBox: null,
  setEditorBox: () => {},
  canvasInstance: null,
  previewBox: null,
  canvasHistory: null,
  PosisionbtnRef: null,
  regenerateRef: null,
  generateBtnRef: null,
  canvasRef: null,
  canvasHistoryRef: null,
  generateBox: null,
  currentCanvasIndex: null,
  bringImageToFront: () => {},
  sendImageToBack: () => {},
  outerDivRef: null,
  addimgToCanvas: () => {},
  addimgToCanvasSubject: () => {},
  addimgToCanvasGen: () => {},
  modifidImageArray: [],
  setModifidImageArray: (modifidImageArray: string[]) => {},
  jobId: [],
  setJobId: (jobId: string[]) => {},
  jobIdOne: [],
  setJobIdOne: (jobIdOne: string[]) => {},
  getBase64FromUrl: () => {},
  file: null,
  setFile: () => {},
  mainLoader: false,
  setMainLoader: () => {},
  assetLoader: false,
  setassetLoader: () => {},
  brandassetLoader: false,
  setbrandassetLoader: () => {},
  viewMore: {},
  setViewMore: (viewMore: Object) => {},
  currentStep: -1,
  setCurrentStep: (currentStep: number) => {},
  activeTemplet: {},
  setActiveTemplet: () => {},
  popupImage: {},
  setPopupImage: (popupImage: object) => {},
  fetchAssetsImagesWithProjectId: () => {},
  selectResult: 1,
  setSelectedresult: (selectResult: number) => {},
  product: "",
  setProduct: (product: string) => "",
  file3d: null,
  setFile3d: () => {},
  uploadedProductlist: [],
  setUploadedProductlist: (uploadedProductlist: string[]) => {},
  generatedImgList: [],
  setGeneratedImgList: (generatedImgList: any[]) => {},
  assetL3doader: false,
  setasset3dLoader: () => {},
  previewLoader: false,
  setPriviewLoader: () => {},
  generationLoader: false,
  setGenerationLoader: () => {},
  TDMode: false,
  set3dMode: () => {},
  newEditorBox: {},
  loadercarna: false,
  setloadercarna: () => {},
  renderer: null,
  setRenderer: () => {},
  loader: false,
  setLoader: () => {},
  category: null,
  setcategory: () => {},
  popup: {},
  setPopup: () => {},
  regeneratePopup: {},
  setRegeneratePopup: () => {},
  removepopu3d: {},
  setremovepopu3d: () => {},
  stageRef: null,
  lines: [],
  setLines: () => {},
  filteredArray: [],
  setFilteredArray: () => {},

  listofassetsById: [],
  setListOfAssetsById: () => {},
  file3dName: {},
  setFile3dName: () => {},
  listofassets: null,
  setListOfAssets: () => {},

  linesHistory: [],
  setLinesHistory: () => {},

  mode: "pen",
  setMode: (mode: string) => {},
  regenratedImgsJobId: null,
  setRegenratedImgsJobid: (regenratedImgsJobId: string) => {},

  crop: false,
  setCrop: () => {},
  filsizeMorethan10: false,
  setfilsizeMorethan10: () => {},
  canvasDisable: false,
  setCanvasDisable: () => {},

  regenratingId: "",
  setregeneraatingId: () => {},
  tdFormate: "",
  setTdFormate: (tdFormate: string) => {},
  promt: "",
  setpromt: (promt: string) => {},

  file3dUrl: "",
  setFile3dUrl: () => {},

  changeRectangleSize: () => {},
  generate3dHandeler: () => {},

  positionBtn: () => {},
  handleDownload: () => {},
  generateImageHandeler: () => {},

  fetchAssetsImages: () => {},
  fetchGeneratedImages: () => {},
  RegenerateImageHandeler: () => {},
  AssetsActivTab: "",
  setassetsActiveTab: (AssetsActivTab: string) => {},
  listofassetsBarand: null,
  setListOfAssetsBrand: () => {},
  userId: "",
  setUserID: (userId: string) => {},

  promtFull: "",
  setpromtFull: (promtFull: string) => {},

  projectId: null,
  setprojectId: (projectId: string) => {},
  downloadeImgFormate: null,
  setDownloadeImgFormate: (downloadeImgFormate: string) => {},
  magickErase: false,
  setmagickErase: () => {},

  zoom: 0,
  setZoomCanvas: () => {},
  getSupabaseImage: () => {},
  activeSize: {},
  setActiveSize: (activeSize: Object) => {},
  templet: {},
  setTemplet: (templet: Object) => {},
  project: [],
  setproject: (project: Object) => {},
  projectlist: [],
  setprojectlist: (projectlist: Object) => {},
});

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const canvasInstance = useRef<any | null>(null);

  const [filteredArray, setFilteredArray] = useState([]);
  const outerDivRef = useRef(null);
  const [mainLoader, setMainLoader] = useState<boolean>(true);
  const [selectedImg, setSelectedImg] = useState<object | null>(null);
  const [downloadImg, setDownloadImg] = useState<string | null>(null);
  const [isMagic, setIsMagic] = useState<boolean | null>(false);
  const [activeTab, setActiveTab] = useState<number | null>(1);
  const [activeTabHome, setActiveTabHome] = useState<number | null>(1);
  const [file, setFile] = useState<File | null>(null);
  const [file3d, setFile3d] = useState<File | null | string>(null);
  const [file3dUrl, setFile3dUrl] = useState<string | null>(null);
  const [file3dName, setFile3dName] = useState<any | null>(null);
  const [isOpen, setisOpen] = useState(true);
  const [viewMore, setViewMore] = useState<object>({});
  const [elevatedSurface, setElevatedSurface] = useState();

 
  const [selectResult, setSelectedresult] = useState<number>(2);

  const [templet, setTemplet] = useState<object | null>(null);
  const [promt, setpromt] = useState<string>("");
  const [promtFull, setpromtFull] = useState("");
  const [product, setProduct] = useState<string>("");

  const [uploadedProductlist, setUploadedProductlist] = useState<string[]>([]);
  const [previewLoader, setPriviewLoader] = useState<boolean>(false);
  const [generationLoader, setGenerationLoader] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [modifidImageArray, setModifidImageArray] = useState<string[]>([]);
  const [removepopu3d, setremovepopu3d] = useState<object | boolean>({});
  const [editorBox, setEditorBox] = useState<fabric.Rect | null>(null);
  const [zoom, setZoomCanvas] = useState<number>(0.7);
  const [canvasDisable, setCanvasDisable] = useState<boolean>(false);
  const [popup, setPopup] = useState<object>({});
  const [popupImage, setPopupImage] = useState<object>({});
  const [regeneratePopup, setRegeneratePopup] = useState<object>({});
  const [projectlist, setprojectlist] = useState<object[]>([]);
  const [project, setproject] = useState<object[]>([]);
  const [generatedImgList, setGeneratedImgList] = useState<any>([]);
  const [jobId, setJobId] = useState<string[]>([]);
  const [jobIdOne, setJobIdOne] = useState<string[]>([]);
  const [tdFormate, setTdFormate] = useState(".gltf");
  const [regenratingId, setregeneraatingId] = useState(null);
  const PosisionbtnRef = useRef<any | null>(null);
  const canvasRef = useRef<any | null>(null);
  const regenerateRef = useRef<any | null>(null);
  const generateBtnRef = useRef<any | null>(null);
  const generateBox = useRef<any | null>(null);
  const previewBox = useRef<any | null>(null);
  const canvasHistoryRef = useRef([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const canvasHistory = useRef<any | null>([]);
  const currentCanvasIndex = useRef<any | null>(-1);
  const stageRef = useRef<any | null>(null);
  const [regenratedImgsJobId, setRegenratedImgsJobid] = useState<string | null>(
    null
  );
  const [projectId, setprojectId] = useState<string | null>(null);
  const [category, setcategory] = useState(null);
  const [listofassets, setListOfAssets] = useState(null);
  const [listofassetsBarand, setListOfAssetsBrand] = useState<any | null>(null);
  const [listofassetsById, setListOfAssetsById] = useState<any[]>([]);
  const [assetLoader, setassetLoader] = useState(false);
  const [assetL3doader, setasset3dLoader] = useState(false);
  const [brandassetLoader, setbrandassetLoader] = useState(false);
  const [activeTemplet, setActiveTemplet] = useState<null | object>(null);
  const [downloadeImgFormate, setDownloadeImgFormate] = useState("png");
  const [incremetPosition, setIncremetPosition] = useState(0);
  const [magickErase, setmagickErase] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [AssetsActivTab, setassetsActiveTab] = useState("product");
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [scene, setscene] = useState(null);
  const [camera, setcamera] = useState(null);
  const [TDMode, set3dMode] = useState(false);
  const [linesHistory, setLinesHistory] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [mode, setMode] = useState<string>("pen");
  const [crop, setCrop] = useState(false);
  const [filsizeMorethan10, setfilsizeMorethan10] = useState(false);
  const [loadercarna, setloadercarna] = useState(false);
  const [userId, setUserID] = useState<string | null>(null);
  const [activeSize, setActiveSize] = useState<{
    id: number;
    title: string;
    subTittle: string;
    h: number;
    w: number;
    l: number;
    t: number;
    gl: number;
    gt: number;
  }>({
    id: 1,
    title: "Default",
    subTittle: "512X512",
    h: 512,
    w: 512,
    l: 50,
    t: 170,
    gl: 592,
    gt: 170,
  });


  
  const handleDownload = (url: string) => {
    saveAs(url, `image${Date.now()}.${downloadeImgFormate}`);
  };

  const addimgToCanvas = async (url: string) => {
    fabric.Image.fromURL(await getBase64FromUrl(url), function (img: any) {
      img.scaleToWidth(150);
      const getRandomPosition = (max: number) =>
        Math.floor(Math.random() * max);
      const randomLeft = getRandomPosition(
        canvasInstance?.current.width / 2 - img.width
      );
      const randomTop = getRandomPosition(
        canvasInstance?.current.height - img.height
      );
      img.set({
        left: randomLeft,
        top: randomTop,
        zIndex: 10,
      });
      img.on("selected", () => {
        const rebtn = regenerateRef?.current as HTMLElement;
        if (rebtn) {
          rebtn.style.display = "none";
          positionBtn(img);
        }
      });
      img.on("moving", () => {
        positionBtn(img);
      });
      img.on("scaling", function () {
        positionBtn(img);
      });
      img.set("zIndex", 10);
      img.set("category", "mask");
      canvasInstance?.current.add(img);
      canvasInstance?.current.renderAll();
      saveCanvasState();
      saveCanvasToDatabase();
    });
  };

  // adding prodect image to  canvas
  const addimgToCanvasSubject = async (url: string) => {
    fabric.Image.fromURL(await getBase64FromUrl(url), function (img: any) {
      // Set the image's dimensions
      img.scaleToWidth(200);
      const canvasWidth = activeSize.w;
      const canvasHeight = activeSize.h;
      const imageAspectRatio = img.width / img.height;

      // Calculate the maximum width and height based on the canvas size
      const maxWidth = canvasWidth;
      const maxHeight = canvasHeight;
      const getRandomPosition = (max: number) =>
        Math.floor(Math.random() * max);

      const randomLeft = getRandomPosition(
        canvasInstance?.current?.width / 2 - img.width
      );
      const randomTop = getRandomPosition(300);
      img.set({
        left: 300,
        top: 300,
      });

      // Calculate the scaled width and height while maintaining the aspect ratio
      let scaledWidth = maxWidth;
      let scaledHeight = scaledWidth / imageAspectRatio;

      // If the scaled height exceeds the canvas height, scale it down
      if (scaledHeight > maxHeight) {
        scaledHeight = maxHeight;
        scaledWidth = scaledHeight * imageAspectRatio;
      }

      img.scaleToWidth(activeSize.w / 2);
      img.scaleToHeight(activeSize.w / 2);

      img.on("selected", () => {
        const rebtn = regenerateRef?.current as HTMLElement;
        if (rebtn) {
          rebtn.style.display = "none";
        }
        const btn = PosisionbtnRef?.current;
        if (btn) {
          btn.style.display = "flex";
          positionBtn(img);
        }
      });

      img.on("moving", () => {
        const btn = PosisionbtnRef?.current;
        if (btn) {
          btn.style.display = "flex";
          positionBtn(img);
        }
      });

      img.on("scaling", () => {
        positionBtn(img);
      });

      img.set("zIndex", 10);
      img.set({ category: "subject" });
      canvasInstance?.current?.add(img);
      canvasInstance?.current?.setActiveObject(img);
      canvasInstance?.current?.renderAll();
      saveCanvasState();
    });
  };
  // to add generate image to canvas
  const addimgToCanvasGen = async (url: string) => {
    fabric.Image.fromURL(await getBase64FromUrl(url), function (img: any) {
      // Set the image's dimensions
      const canvasWidth = activeSize.w;
      const canvasHeight = activeSize.h;
      const imageAspectRatio = img.width / img.height;

      // Calculate the maximum width and height based on the canvas size
      const maxWidth = canvasWidth;
      const maxHeight = canvasHeight;

      // Calculate the scaled width and height while maintaining the aspect ratio
      let scaledWidth = maxWidth;
      let scaledHeight = scaledWidth / imageAspectRatio;

      img.on("selected", () => {
        const rebtn = regenerateRef?.current as HTMLElement;
        rebtn.style.display = "block";
        positionBtn(img);
        RegeneratepositionBtn(img);
        const btn = PosisionbtnRef?.current;
        if (btn) {
          btn.style.display = "flex";
        }
      });

      img.on("moving", () => {
        const rebtn = regenerateRef?.current as HTMLElement;
        rebtn.style.display = "block";
        positionBtn(img);
        RegeneratepositionBtn(img);
        const btn = PosisionbtnRef?.current;
        if (btn) {
          btn.style.display = "flex";
        }
      });

      img.on("scaling", () => {
        const btn = PosisionbtnRef?.current;
        if (btn) {
          btn.style.display = "flex";
          positionBtn(img);
        }
        RegeneratepositionBtn(img);
      });

      img.scaleToWidth(scaledWidth);
      img.scaleToHeight(scaledHeight);
      // Set the position of the image
      img.set({
        left: activeSize.gl,
        top: activeSize.gt,
        id: url,
      });
      img.set("zIndex", 10);
      setIncremetPosition(incremetPosition + 25);
      img.set("category", "generated");
      canvasInstance?.current.add(img);
      canvasInstance?.current.setActiveObject(img);
      canvasInstance?.current.renderAll();
      saveCanvasState();
      saveCanvasToDatabase();
    });
  };

  /**
   * Positions a button relative to an object on a canvas.
   *
   * This function is used to position a button (like delete or download) near a specific object
   * on a canvas. It's particularly useful for interactive canvas applications where you might
   * want to offer controls for individual elements within the canvas.
   *
   * @param {object} obj - The object on the canvas near which the button will be positioned.
   */
  function positionBtn(obj: any) {
    const btn = PosisionbtnRef?.current;
    if (btn) {
      const absCoords = canvasInstance?.current.getAbsoluteCoords(obj);
      btn.style.left = absCoords.left + 10 + "px";
      btn.style.top = absCoords.top + 10 + "px";
    }
  }
  // this  is for the  regenration btn
  function RegeneratepositionBtn(obj: any) {
    var zooms = canvasInstance?.current.getZoom();
    const btns = regenerateRef?.current as HTMLElement;
    const absCoords = canvasInstance?.current.getAbsoluteCoords(obj);
    btns.style.left =
      absCoords.left - 100 / 2 + (obj.getScaledWidth() * zooms) / 2 + "px";
    btns.style.top = absCoords.top + obj.getScaledHeight() * zooms - 50 + "px";
    setZoomCanvas(zooms);
  }

  // Implement a function to save the current canvas state
  const saveCanvasState = () => {
    const canvasData = canvasInstance?.current?.toDatalessJSON();
    canvasHistory?.current?.splice(currentCanvasIndex?.current + 1);
    canvasHistory?.current?.push(canvasData);
    currentCanvasIndex.current++;
  };

  const GetProjexts = (getUser: string) => {
    axios
      .get(`/api/project?user_id=${getUser}`)
      .then((response) => {
        setprojectlist(response?.data);
        return response?.data;
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
  };

  const GetProjextById = (getUser: any) => {
    axios
      .get(`/api/project?user_id=${userId}&project_id=${getUser}`)
      .then((response) => {
        setproject(response.data[0]);

        return response.data;
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
  };

  // funtion Handel save canvase  to DB
  const saveCanvasToDatabase = async () => {
    const canvasData = canvasInstance.current.toJSON();

    if (canvasData.objects.length > 1 && !loadercarna) {
      SaveProjexts(userId, projectId, canvasData);
    }
  };
  // funtion save canvase  to DB
  const SaveProjexts = async (userId: any, projectId: any, canvas: any) => {
    const json = JSON.stringify({
      user_id: userId,
      project_id: projectId,
      canvasHistory: {},
    });

    try {
      const response = await fetch(`/api/project?user_id=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: json,
      });

      const data = await response.json();
      if (
        data &&
        filteredArray[0] &&
        "modified_image_url" in filteredArray[0]
      ) {
        const jsons = JSON.stringify({
          project_id: projectId,
          user_id: userId,
          previewImage: filteredArray[0]?.modified_image_url,
        });
        const response = await fetch(`/api/project?user_id=${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsons,
        });

    
      }

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const renameProject = async (userId: any, projectId: any, name: any) => {
    const json = JSON.stringify({
      project_id: projectId,
      title: name,
    });
    try {
      const response = await fetch(`/api/project?user_id=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: json,
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  // fetche genrate image
  const fetchGeneratedImages = async (userId: any) => {
    try {
      const data = await getSupabaseImage();
      if (data) {
        setGeneratedImgList(data);
      }

      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchAssetsImages = async (userId: any, pro: any, is_bg_removed) => {
    try {
      let response;
      if (is_bg_removed) {
        response = await fetch(`/api/images`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            is_bg_removed: true,
          }),
        });
      } else {
        response = await fetch(`/api/images`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
          }),
        });
      }

      const data = await response.json();

      if (data?.data.length) {
        const revers = data.data.reverse();
        setListOfAssets(data.data);
        return data.data;
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };
  const fetchAssetsImagesBrant = async (userId: any, pro: any) => {
    try {
      const response = await fetch(`/api/getassets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });
      const data = await response.json();

      if (data?.length) {
        const revers = data.reverse();
        setListOfAssetsBrand(await revers);
      }

      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchAssetsImagesWithProjectId = async (userId: any, pro: any) => {
    try {
      const response = await fetch(`/api/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          project_id: pro,
        }),
      });
      const data = await response.json();

      if (data?.data.length > 0) {
        setListOfAssetsById(data?.data);
      }

      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // funtion to added recent Templete to Database
  const addtoRecently = async (userId: any, proid: any) => {
    try {
      const projectData = await axios.get(
        `/api/project?user_id=${userId}&project_id=${proid}`
      );
      if (projectData.data) {
        const json = JSON.stringify({
          user_id: userId,

          project_id: proid,
          recently: [templet, ...projectData.data[0].recently],
        });

        const queryParams = new URLSearchParams({
          user_id: userId,
          project_id: proid,
          // Add more parameters as needed
        });
        const response = await fetch(`/api/project`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: json,
        });
        const data = await response.json();

        const resData = await response;

        if (resData.ok) {
          GetProjextById(proid);
        }
      }
    } catch (error) {}
  };

  const bringImageToFront = () => {
    const activeObject = canvasInstance?.current.getActiveObject();
    if (activeObject) {
      activeObject.sendBackwards();
      canvasInstance.current.bringToFront(activeObject);
      canvasInstance.current.discardActiveObject();
      canvasInstance.current.renderAll();
    }
  };
  const sendImageToBack = () => {
    const activeObject = canvasInstance.current.getActiveObject();
    if (!activeObject) {
      toast("Please select an object on the canvas first.");
      return;
    }
    canvasInstance.current.sendBackwards(activeObject);
    canvasInstance.current.discardActiveObject();
    canvasInstance.current.renderAll();
  };

  //  canvas box
  const newEditorBox = new fabric.Rect({
    left: activeSize.l,
    top: activeSize.t,
    width: activeSize.w,
    height: activeSize.h,
    selectable: false,
    fill: "transparent",
    stroke: "rgba(249, 208, 13, 1)",
    strokeWidth: 1,
    excludeFromExport: true,
  } as any);

  const imageGenRect = new fabric.Rect({
    left: 660,
    top: 160,
    width: 512,
    height: 512,
    selectable: false,
    fill: "rgba(249, 208, 13, 0.23)",
    excludeFromExport: true,
  });

  // change the canvas boxe size when templet size change
  const changeRectangleSize = () => {
    newEditorBox.set({ width: activeSize.w, height: activeSize.h });
    canvasInstance?.current.renderAll();
  };

  //  fuction for genrating image
  const generateImageHandeler = async (ueserId: any, proid: any) => {
    var subjectCount = 0;

    setLoader(false);
    setCanvasDisable(false);
    const startTime = new Date().getTime();
    canvasInstance?.current.forEachObject(function (obj: any) {
      if (obj.category === "subject") {
        if (newEditorBox.intersectsWithObject(obj)) {
          subjectCount++;
        } else {
        }
      }
    });

    if (category === null) {
      toast("Select your product category first !");
    } else if (subjectCount === 0 && !TDMode) {
      toast("Add product first");
    } else if (product === "" || product === null || product === " ") {
      toast("Add product Name");
    } else if (promt === "" || promt === null || promt === " ") {
      toast("Select a templet or Describe your promt  ");
    } else {
      setLoader(true);
      setCanvasDisable(true);

      const canvas1 = canvasInstance.current;
      try {
        if (templet?.title) {
          addtoRecently(ueserId, proid);
        }
        const objects = canvas1.getObjects();
        const subjectObjects: any = [];
        objects.forEach((object: any) => {
          if (object.category === "subject") {
            subjectObjects.push(object);
          }
        });

        // Make image with only the subject objects inside the newEditorBox
        const subjectCanvas = new fabric.Canvas(null, {
          left: activeSize.l,
          top: activeSize.t,
          width: activeSize.w,
          height: activeSize.h,
          backgroundColor: "#fdf5cf",
        } as any);

        subjectObjects.forEach((object: any) => {
          const gg = object;
          gg.set({
            left: object.left - activeSize.l,
            top: object.top - activeSize.t,
          });
          subjectCanvas.add(gg);
        });

        const originalsubjectDataUrl = subjectCanvas.toDataURL({
          format: "png",
          multiplier: 4,
        });
        const subjectDataUrl = await scaleDownImage(originalsubjectDataUrl);

        subjectObjects.forEach((object: any) => {
          object.set({
            left: object.left + activeSize.l,
            top: object.top + activeSize.t,
          });
          subjectCanvas.remove(object);
          canvasInstance.current.remove(object);
          canvasInstance.current.add(object);
          canvasInstance.current.renderAll();
        });

        const promtText = promt;

        axios
          .post(`/api/generate`, {
            dataUrl: subjectDataUrl,
            prompt: promtText.trim(),
            user_id: userId,
            category: category,
            num_images: selectResult,
            caption: product,
            project_id: proid,
          })
          .then((response) => {
            const generate_response = response.data;

            const getJobid = generate_response?.job_id;

            if (generate_response?.ok) {
              setJobIdOne([getJobid]);

              GetProjextById(proid);
            } else if (generate_response?.error) {
              toast.error(generate_response?.error);
              setLoader(false);
              return false;
            } else {
              console.error(" ");
            }
          })
          .catch((error) => {
            console.error(error);
            return error;
          });
      } catch (error) {
        console.error("Error generating image:", error);
        toast.error("something went wrong");
        setLoader(false);
      }
    }
  };

  const generate3dHandeler = async (userId: any, proid: any) => {
    if (category === null) {
      toast("Select your product category first !");
    } else if (!file3dUrl && !file3d) {
      toast("Add a 3d model");
    } else if (product === null) {
      toast("Enter your 3d model name ");
    } else if (product === "") {
      toast("Enter your 3d model name ");
    } else if (promtFull === null) {
      toast("Select one templet or Enter custom promt ");
    } else if (promtFull === "") {
      toast("Select one templet or Enter custom promt");
    } else {
      if (renderer === null) {
        toast("Add a 3d model");
      } else {
        setLoader(true);
        const promtText = promt;
        renderer.setSize(activeSize.w * 6, activeSize.h * 6);
        renderer.render(scene, camera);

        const screenshot = renderer.domElement.toDataURL("image/png");
        renderer.setSize(activeSize.w + 100, activeSize.h + 80);
        renderer.render(scene, camera);
        console.log(screenshot);

        let scaledDataURL;
        let subjectDataUrl;
        var canvass = new fabric.Canvas();
        canvass.setWidth(activeSize.w);
        canvass.setHeight(activeSize.h);

        subjectDataUrl = await scaleDownImage(screenshot);
        console.log(subjectDataUrl);

        axios
          .post(`/api/generate`, {
            dataUrl: await subjectDataUrl,
            prompt: promtText.trim(),
            user_id: userId,
            category: category,
            num_images: selectResult,
            is_3d: true,
            caption: product,
          })
          .then((response) => {
            const generate_response = response.data;

            const getJobid = generate_response?.job_id;

            if (generate_response?.ok) {
              setLoader(true);
              setJobIdOne([generate_response?.job_id]);
            } else if (generate_response?.error) {
              toast.error(generate_response?.error);
              setLoader(false);
              return false;
            } else {
              console.error(" ");
            }
          })
          .catch((error) => {
            console.error(error);
            return error;
          });
      }
    }
  };

  //function to regenrate image
  const RegenerateImageHandeler = async (ueserId: any) => {
    setLoader(true);
    setGenerationLoader(true);
    try {
      setLoader(true);
      const response = await fetch("/api/regenerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: regenratingId,
          user_id: ueserId,
        }),
      });

      const generate_response = await response.json();
      if (generate_response?.error) {
        toast.error(generate_response?.error);

        setLoader(false);

        return false;
      } else {
        try {
          setLoader(false);

          setRegenratedImgsJobid(generate_response?.job_id);
        } catch (error) {
          setLoader(false);
        }
      }
    } catch (error) {
      setLoader(false);

      console.error("Error generating image:", error);
    } finally {
      setGenerationLoader(false);
    }
  };

  const getSupabaseImage = async () => {
    const IMG_TABLE = process.env.NEXT_PUBLIC_IMAGE_TABLE;
    if (userId !== null) {
      const { data, error } = await supabase
        .from(IMG_TABLE)
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (data) {
        setGeneratedImgList(data);
        return data;
      } else if (error) {
        return error;
      }
    } else {
      const { data, error } = await supabase
        .from(IMG_TABLE)
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (data) {
        setGeneratedImgList(data);

        return data;
      } else if (error) {
        return error;
      }
      // }
    }
  };
  return (
    <AppContext.Provider
      value={{
        userId,
        setUserID,
        getSupabaseImage,
        canvasDisable,
        filsizeMorethan10,
        setfilsizeMorethan10,
        regenratingId,
        setregeneraatingId,
        tdFormate,
        setTdFormate,
        file3dUrl,
        setFile3dUrl,
        setCanvasDisable,
        changeRectangleSize,
        AssetsActivTab,
        setassetsActiveTab,
        crop,
        generate3dHandeler,
        setCrop,
        stageRef,
        mode,
        setMode,
        linesHistory,
        setLinesHistory,
        magickErase,
        setmagickErase,
        lines,
        setLines,
        zoom,
        setZoomCanvas,
        activeTemplet,
        setActiveTemplet,
        brushSize,
        setBrushSize,
        imageGenRect,
        loadercarna,
        setloadercarna,
        listofassetsById,
        setListOfAssetsById,
        previewBox,
        fetchAssetsImagesBrant,
        file3dName,
        setFile3dName,
        removepopu3d,
        setremovepopu3d,
        promtFull,
        setpromtFull,
        GetProjexts,
        generateBtnRef,
        canvasRef,
        file3d,
        setFile3d,
        projectId,
        downloadeImgFormate,
        setDownloadeImgFormate,
        setprojectId,
        SaveProjexts,
        GetProjextById,
        project,
        setproject,
        saveCanvasToDatabase,
        generateBox,
        currentCanvasIndex,
        regeneratePopup,
        setRegeneratePopup,
        addtoRecently,
        generateImageHandeler,
        PosisionbtnRef,
        regenerateRef,
        bringImageToFront,
        projectlist,
        renameProject,
        setprojectlist,
        sendImageToBack,
        fetchGeneratedImages,
        handleDownload,
        canvasInstance,
        addimgToCanvasGen,
        outerDivRef,
        addimgToCanvas,
        addimgToCanvasSubject,
        selectedImg,
        setSelectedImg,
        getBase64FromUrl,
        RegenerateImageHandeler,
        activeTab,
        setActiveTab,
        activeTabHome,
        setActiveTabHome,
        editorBox,
        setEditorBox,
        regenratedImgsJobId,
        setRegenratedImgsJobid,
        jobId,
        setJobId,
        currentStep,
        setCurrentStep,
        popupImage,
        setPopupImage,
        scaleDownImage,
        jobIdOne,
        setJobIdOne,
        file,
        setFile,
        mainLoader,
        activeSize,
        setActiveSize,
        setMainLoader,

        selectResult,
        canvasHistory,
        setSelectedresult,

        product,
        setProduct,
        listofassets,
        setListOfAssets,

        uploadedProductlist,
        setUploadedProductlist,
        templet,
        setTemplet,
        previewLoader,
        setPriviewLoader,
        generationLoader,
        setGenerationLoader,
        viewMore,
        fetchAssetsImages,
        setViewMore,
        isMagic,
        setIsMagic,
        downloadImg,
        listofassetsBarand,
        setListOfAssetsBrand,
        setDownloadImg,
        popup,
        setPopup,
        generatedImgList,
        setGeneratedImgList,
        loader,
        setLoader,
        positionBtn,
        promt,
        assetLoader,
        setassetLoader,
        brandassetLoader,
        setbrandassetLoader,
        setpromt,

        modifidImageArray,
        setModifidImageArray,
        fetchAssetsImagesWithProjectId,
        filteredArray,
        setFilteredArray,
        category,
        setcategory,
        TDMode,
        set3dMode,
        renderer,
        setRenderer,
        assetL3doader,
        setasset3dLoader,
        newEditorBox,
        elevatedSurface,
        setElevatedSurface,
        canvasHistoryRef,
        isOpen,
        setisOpen,

        scene,
        setscene,
        camera,
        setcamera,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GloabalProvider");
  }
  return context;
}
