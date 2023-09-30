import requests

uberduck_auth = ("pub_timrwpfdwjhvhqgyrw", "pk_abf1235c-7548-4c81-aee6-245c0b8aca6c")

status = requests.get("https://api.uberduck.ai/status")
print(status.json())

#voices = requests.get("https://api.uberduck.ai/voices", params=dict(mode="tts-basic"))
#with open('voices.txt', 'w', encoding='utf-8') as file:
#    file.write(voices.content.decode('utf-8'))

voicemodel_uuid = "eaee7f5d-90d6-4c66-9f9d-1bd639e7d1f1"
text = "War is cruelty, and you cannot refine it; and those who brought war into our country deserve all the curses and maledictions a people can pour out. I know I had no hand in making this war, and I know I will make more sacrifices to-day than any of you to secure peace."

audio_uuid = requests.post(
    "https://api.uberduck.ai/speak",
    json=dict(speech=text, voicemodel_uuid=voicemodel_uuid),
    auth=uberduck_auth,
).json()["uuid"]

print(audio_uuid)

from time import sleep

for t in range(10):
    sleep(1)  # Check status every second for 10 seconds.
    output = requests.get(
        "https://api.uberduck.ai/speak-status",
        params=dict(uuid=audio_uuid),
        auth=uberduck_auth,
    ).json()
    if "path" in output and output["path"] is not None:
        audio_url = output["path"]
        break

print(output)