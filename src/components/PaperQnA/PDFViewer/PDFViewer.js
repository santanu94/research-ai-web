import React, { useState } from "react";
import "./PDFViewer.css";
import { Document, Page, pdfjs } from "react-pdf";
import { MdOutlineError } from "react-icons/md";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { FaRotateRight } from "react-icons/fa6";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { GrRotateRight } from "react-icons/gr";
import { TbZoomScan } from "react-icons/tb";
import { useResizeDetector } from "react-resize-detector";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SimpleBar from "simplebar-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.js",
//   import.meta.url
// ).toString();

const PDFViewer = ({ url }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pdfRotation, setPdfRotation] = useState(0);
  const { width, ref } = useResizeDetector();

  const customPageInputValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(customPageInputValidator),
  });

  const handlePageNumberInput = ({ page }) => {
    setPageNumber(Number(page));
    setValue("page", String(page));
  };

  // function onDocumentLoadSuccess({ numPages }) {
  //   setNumPages(numPages);
  // }

  return (
    <div className="pdf-viewer-container">
      <div className="controls">
        <div className="d-flex align-items-center">
          <button
            type="button"
            className="btn btn-light margin-right"
            aria-label="previous page"
            onClick={() => {
              setPageNumber(pageNumber - 1 > 1 ? pageNumber - 1 : 1);
              setValue("page", String(pageNumber - 1));
            }}
            disabled={pageNumber <= 1}
          >
            <FaAngleDown className="button-icon" />
          </button>
          <input
            {...register("page")}
            className={`form-control shadow-none ${
              errors.page ? "border border-danger" : ""
            }`}
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(handlePageNumberInput)();
              }
            }}
          />
          <span>/</span>
          <span>{numPages ?? "X"}</span>
          <button
            type="button"
            className="btn btn-light margin-left-5"
            aria-label="next page"
            onClick={() => {
              setPageNumber(
                pageNumber + 1 > numPages ? numPages : pageNumber + 1
              );
              setValue("page", String(pageNumber + 1));
            }}
            disabled={numPages === undefined || pageNumber === numPages}
          >
            <FaAngleUp className="button-icon" />
          </button>
        </div>
        <div className="d-flex flex-grow-1"></div>

        {/* <Dropdown>
          <Dropdown.Toggle id="zoom-dropdoown" className="zoom-btn">
            <TbZoomScan className="zoom-icon" />
            {scale * 100}%
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setScale(1)}>100%</Dropdown.Item>
            <Dropdown.Item onClick={() => setScale(1.5)}>150%</Dropdown.Item>
            <Dropdown.Item onClick={() => setScale(2)}>200%</Dropdown.Item>
            <Dropdown.Item onClick={() => setScale(2.5)}>250%</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}
        <div className="m-auto">
          <button
            onClick={() => setScale(scale + 0.25)}
            className="control-button"
          >
            <IoAddCircleOutline className="control-icon" />
          </button>
          {Math.round(scale * 100)}%
          <button
            onClick={() => setScale(scale - 0.25)}
            className="control-button"
          >
            <IoRemoveCircleOutline className="control-icon" />
          </button>
        </div>
        <div className="m-auto">
          <button
            aria-label="rotate 90 degrees"
            onClick={() => setPdfRotation((prev) => prev + 90)}
            className="control-button margin-left-10"
          >
            <GrRotateRight className="control-icon" />
          </button>
        </div>
      </div>
      {/* <nav>
        <button
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber <= 1}
        >
          Prev
        </button>
        <span>
          Page {pageNumber} of {numPages}
        </span>
        <button
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={pageNumber >= numPages}
        >
          Next
        </button>
        <button onClick={() => setScale(scale + 0.1)}>Zoom In</button>
        <button onClick={() => setScale(scale - 0.1)}>Zoom Out</button>
      </nav> */}
      <div className="pdf-viewer min-h-80vh">
        <SimpleBar autoHide={false} className="simplebar-maxheight">
          <div ref={ref}>
            <Document
              file={url}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={
                <div class="d-flex justify-content-center align-items-center">
                  <div className="spinner spinner-grow" role="status"></div>
                </div>
              }
              onLoadError={() => {
                <div>
                  <MdOutlineError /> Oops! Something went wrong while loading
                  the Paper. We are looking into it, so please try again later.
                </div>;
              }}
              className="pdf-document"
            >
              <Page
                width={width ? width : 1}
                pageNumber={pageNumber}
                scale={scale}
                rotate={pdfRotation}
                renderTextLayer={false}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PDFViewer;
