import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class JsonToExcelService {
  constructor() { }

  generateAndDownloadExcel(data: any[], filename: string): void {
    const excelXml = this.generateExcelXML(data);
    this.downloadFile(excelXml, filename);
  }

  generateExcelXML(data: any[]): string {
    let Workbook, WorkbookStart = '<?xml version="1.0"?><ss:Workbook  xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">';
    const WorkbookEnd = '</ss:Workbook>';
    let fs, SheetName = 'SHEET 1',
      styleID = 1, columnWidth = 80,
      fileName = "Employee_List", uri, link;

    const myXMLStyles = function (id:any) {
      let Styles = '<ss:Styles><ss:Style ss:ID="' + id + '"><ss:Font ss:Bold="1"/></ss:Style></ss:Styles>';

      return Styles;
    }

    const myXMLWorkSheet = function (name:any, o:any) {
      const Table = myXMLTable(o);
      let WorksheetStart = '<ss:Worksheet ss:Name="' + name + '">';
      const WorksheetEnd = '</ss:Worksheet>';

      return WorksheetStart + Table + WorksheetEnd;
    }

    const myXMLTable = function (o:any) {
      let TableStart = '<ss:Table>';
      const TableEnd = '</ss:Table>';

      const tableData = JSON.parse(o);

      if (tableData.length > 0) {
        const columnHeader = Object.keys(tableData[0]);
        let rowData = '';
        for (let i = 0; i < columnHeader.length; i++) {
          TableStart += myXMLColumn(columnWidth);
        }
        for (let j = 0; j < tableData.length; j++) {
          rowData += myXMLRow(tableData[j], columnHeader);
        }
        TableStart += myXMLHead(1, columnHeader);
        TableStart += rowData;
      }

      return TableStart + TableEnd;
    }

    const myXMLColumn = function (w:any) {
      return '<ss:Column ss:AutoFitWidth="0" ss:Width="' + w + '"/>';
    }

    const myXMLHead = function (id:any, h:any) {
      let HeadStart = '<ss:Row ss:StyleID="' + id + '">';
      const HeadEnd = '</ss:Row>';

      for (let i = 0; i < h.length; i++) {
        const Cell = myXMLCell(h[i].toUpperCase());
        HeadStart += Cell;
      }

      return HeadStart + HeadEnd;
    }

    const myXMLRow = function (r:any, h:any) {
      let RowStart = '<ss:Row>';
      const RowEnd = '</ss:Row>';
      for (let i = 0; i < h.length; i++) {
        const Cell = myXMLCell(r[h[i]]);
        RowStart += Cell;
      }

      return RowStart + RowEnd;
    }

    const myXMLCell = function (n:any) {
      let CellStart = '<ss:Cell>';
      const CellEnd = '</ss:Cell>';

      const Data = myXMLData(n);
      CellStart += Data;

      return CellStart + CellEnd;
    }

    const myXMLData = function (d:any) {
      let DataStart = '<ss:Data ss:Type="String">';
      const DataEnd = '</ss:Data>';

      return DataStart + d + DataEnd;
    }

    const flatten :any = function (obj:any) {
      var obj1 = JSON.parse(JSON.stringify(obj));
      const obj2 = JSON.parse(JSON.stringify(obj));
      if (typeof obj === 'object') {
        for (var k1 in obj2) {
          if (obj2.hasOwnProperty(k1)) {
            if (typeof obj2[k1] === 'object' && obj2[k1] !== null) {
              delete obj1[k1]
              for (var k2 in obj2[k1]) {
                if (obj2[k1].hasOwnProperty(k2)) {
                  obj1[k1 + '-' + k2] = obj2[k1][k2];
                }
              }
            }
          }
        }
        var hasObject = false;
        for (var key in obj1) {
          if (obj1.hasOwnProperty(key)) {
            if (typeof obj1[key] === 'object' && obj1[key] !== null) {
              hasObject = true;
            }
          }
        }
        if (hasObject) {
          return flatten(obj1);
        } else {
          return obj1;
        }
      } else {
        return obj1;
      }
    }

    let finalDataArray = [];

    for (let i = 0; i < data.length; i++) {
      finalDataArray.push(flatten(data[i]));
    }

    let s = JSON.stringify(finalDataArray);
    fs = s.replace(/&/gi, '&amp;');

    const Worksheet = myXMLWorkSheet(SheetName, fs);

    WorkbookStart += myXMLStyles(styleID);

    Workbook = WorkbookStart + Worksheet + WorkbookEnd;

    return Workbook;
  }

  downloadFile(data: string, filename: string): void {
    const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // Click the link programmatically to start the download
    link.click();

    // Clean up
    window.URL.revokeObjectURL(url);
  }

  convertToJSON(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array((event.target as FileReader).result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const keys:any = jsonData[0];
        const values = jsonData.slice(1);

        const jsonArray = values.map((row:any) => {
          const obj: any = {};
          keys.forEach((key:any, index:any) => {
            obj[key] = row[index];
          });
          return obj;
        });

        resolve(jsonArray);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  }
}
