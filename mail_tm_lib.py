import aiohttp
import asyncio

class MailTmLib:
    def __init__(self, api_url):
        self.api_url = api_url
        self.token = None

    async def login(self, username, password):
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{self.api_url}/token", data={"username": username, "password": password}) as response:
                data = await response.json()
                self.token = data['access_token']
                return self.token

    async def create_email(self, address):
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{self.api_url}/email/create/", json={"address": address}, headers=self._get_headers()) as response:
                return await response.json()

    async def get_emails(self, folder):
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.api_url}/emails/{folder}", headers=self._get_headers()) as response:
                return await response.json()

    async def get_email(self, email_id):
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.api_url}/emails/{email_id}", headers=self._get_headers()) as response:
                return await response.json()

    async def send_email(self, to, subject, body):
        data = {"to": to, "subject": subject, "body": body}
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{self.api_url}/email/send/", json=data, headers=self._get_headers()) as response:
                return await response.json()

    async def delete_email(self, email_id):
        async with aiohttp.ClientSession() as session:
            async with session.delete(f"{self.api_url}/emails/{email_id}", headers=self._get_headers()) as response:
                return response.status == 204

    def _get_headers(self):
        return {"Authorization": f"Bearer {self.token}"}

# Example usage
async def main():
    lib = MailTmLib("http://localhost:8000")
    await lib.login("username", "password")
    emails = await lib.get_emails("inbox")
    print(emails)

if __name__ == "__main__":
    asyncio.run(main())
