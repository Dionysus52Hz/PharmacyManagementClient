import * as XLSX from 'xlsx';

export async function excelToJson(
   url: string,
   sheetName: string
): Promise<any[]> {
   const response = await fetch(url);
   if (!response.ok) {
      throw new Error(`Error fetching the file: ${response.statusText}`);
   }

   const data = await response.arrayBuffer();
   const workbook = XLSX.read(data, { type: 'array' });

   const worksheet = workbook.Sheets[sheetName];

   const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
   });

   const headers = jsonData[0];
   const result = jsonData.slice(1).map((row: any[]) => {
      const obj: { [key: string]: any } = {};
      headers.forEach((header, index) => {
         obj[header] = row[index];
      });
      return obj;
   });
   return result;
}
