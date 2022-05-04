type GenerateUploadUrlResponse = {
  url: string;
};

export type Image = {
  id: string;
  uploaderID: string;
  thumbnailURL: string;
  publicURL: string;
};

class ImagesApiClient {
  private readonly host: string;
  private readonly apiKey: string;

  constructor(host: string, apiKey: string) {
    this.host = host;
    this.apiKey = apiKey;
  }

  async generateUploadUrl(uploaderId: string): Promise<string> {
    const url = `${this.host}/v1/images/upload-url`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "X-Api-Key": this.apiKey },
      body: JSON.stringify({
        serviceID: "til.webdonalds.org",
        uploaderID: uploaderId,
      }),
    });
    return (await response.json() as GenerateUploadUrlResponse).url;
  }

  async listImages(): Promise<Image[]> {
    const url = `${this.host}/v1/images`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "X-Api-Key": this.apiKey },
    });
    return await response.json();
  }

  async uploadImage(url: string, image: File) {
    const formData = new FormData();
    formData.append("file", image);

    await fetch(url, { method: "POST", body: formData });
  }
}

const host = process.env.IMAGES_API_HOST;
const apiKey = process.env.IMAGES_API_KEY;
if (!host || !apiKey) {
  throw new Error("API host and key required");
}

export const client = new ImagesApiClient(host, apiKey);
