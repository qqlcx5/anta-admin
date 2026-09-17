import { isClient } from "./is";
import { openLink } from "./dom";

/**
 * 通过 Base64 下载文件
 */
export function downloadByBase64(
  buf: string,
  filename: string,
  mime?: string,
  bom?: BlobPart
) {
  const base64Buf = dataURLtoBlob(buf);
  downloadByData(base64Buf, filename, mime, bom);
}

/**
 * 通过 Blob 或数据对象下载
 */
export function downloadByData(
  data: BlobPart,
  filename: string,
  mime?: string,
  bom?: BlobPart
) {
  if (!isClient) return;
  const blobData = typeof bom !== "undefined" ? [bom, data] : [data];
  const blob = new Blob(blobData, { type: mime || "application/octet-stream" });

  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement("a");
  tempLink.style.display = "none";
  tempLink.href = blobURL;
  tempLink.setAttribute("download", filename);
  if (typeof tempLink.download === "undefined") {
    tempLink.setAttribute("target", "_blank");
  }
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(blobURL);
}

/**
 * 将 base64 转为 Blob
 */
function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * 根据在线 URL 下载文件
 */
export function downloadByOnlineUrl(
  url: string,
  filename?: string,
  mime?: string,
  bom?: BlobPart
) {
  if (!isClient) return;
  fetch(url)
    .then(res => res.blob())
    .then(blob => {
      downloadByData(blob, filename || url.substring(url.lastIndexOf("/") + 1), mime, bom);
    });
}

/**
 * 通过 a 标签触发链接下载
 */
export function downloadByUrl(
  optionsOrUrl:
    | string
    | {
        url: string;
        target?: string;
        fileName?: string;
      },
  fileName?: string,
  target = "_self"
): boolean {
  if (!isClient) return false;
  let url = "";
  let finalFileName = fileName;
  let finalTarget = target;

  if (typeof optionsOrUrl === "string") {
    url = optionsOrUrl;
  } else if (optionsOrUrl && typeof optionsOrUrl === "object") {
    url = optionsOrUrl.url;
    finalFileName = optionsOrUrl.fileName ?? fileName;
    finalTarget = optionsOrUrl.target ?? target;
  }

  if (!url) return false;
  const isChrome = window.navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
  const isSafari = window.navigator.userAgent.toLowerCase().indexOf("safari") > -1;

  if (isChrome || isSafari) {
    const link = document.createElement("a");
    link.href = url;
    link.target = finalTarget;
    if (link.download !== undefined) {
      link.download = finalFileName || url.substring(url.lastIndexOf("/") + 1, url.length);
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }

  if (url.indexOf("?") === -1) {
    url += "?download";
  }
  openLink(url, finalTarget);
  return true;
}
