import json
import requests
import io
import base64
import sys


from PIL import Image, PngImagePlugin

url = "http://192.168.68.66:7860"

print('int')



payload = {
    "prompt": sys.argv[1],
    "steps": sys.argv[2],
    "width": sys.argv[3],
    "height": sys.argv[4]
}

response = requests.post(url=f'{url}/sdapi/v1/txt2img', json=payload)
#print(response.text)

r = response.json()

for i in r['images']:
    image = Image.open(io.BytesIO(base64.b64decode(i.split(",",1)[0])))

    png_payload = {
        "image": "data:image/png;base64," + i
    }
    response2 = requests.post(url=f'{url}/sdapi/v1/png-info', json=png_payload)
    pnginfo = PngImagePlugin.PngInfo()
    pnginfo.add_text("parameters", response2.json().get("info"))
    image.save('output.png', pnginfo=pnginfo)
