import requests
from typing import Optional

def generate_qr_code(upi_link: str) -> Optional[str]:
    """
    Generate a fully-grey QR with UPI logo centered using qrcode-monkey API.
    :param upi_link: UPI URI string to encode.
    :return: URL of the generated PNG or None if failed.
    """
    try:
        payload = {
            "data": upi_link,
            "config": {
                "body": "circular",
                "eye": "frame13",
                "eyeBall": "ball14",
                # uniform grey modules
                "bodyColor": "#808080",
                "bgColor": "#FFFFFF",    # white background
                "eye1Color": "#808080",
                "eye2Color": "#808080",
                "eye3Color": "#808080",
                "eyeBall1Color": "#808080",
                "eyeBall2Color": "#808080",
                "eyeBall3Color": "#808080",
                # no gradient—solid grey
                "gradientType": "linear",
                "gradientColor1": "#808080",
                "gradientColor2": "#808080",
                "gradientOnEyes": "false",
                # your uploaded logo filename
                "logo": "c5fc482c51604b15142a8c61024e7c2797bf0a80.png",
                "logoMode": "default"
            },
            "size": 2000,          # high-res
            "download": "imageUrl",
            "file": "png"
        }

        resp = requests.post("https://api.qrcode-monkey.com/qr/custom", json=payload, timeout=30)
        resp.raise_for_status()
        
        result = resp.json()
        if "imageUrl" in result:
            print(f"✅ QR Code generated successfully: {result['imageUrl']}")
            return result["imageUrl"]
        else:
            print(f"❌ Unexpected API response: {result}")
            return None
            
    except requests.HTTPError as err:
        print(f"❌ QR API Error: {err}")
        return None
    except Exception as e:
        print(f"❌ QR Generation Unexpected Error: {e}")
        return None