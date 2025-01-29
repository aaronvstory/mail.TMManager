import aiohttp

class MailTmClient:
    def __init__(self, token):
        self.token = token
        self.base_url = "https://api.mail.tm"
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

    async def create_email(self, address):
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{self.base_url}/accounts", json={"address": address}, headers=self.headers) as response:
                return await response.json()

    async def get_emails(self, folder):
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.base_url}/messages?page=1&folder={folder}", headers=self.headers) as response:
                data = await response.json()
                return data['hydra:member']

    async def get_email(self, email_id):
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.base_url}/messages/{email_id}", headers=self.headers) as response:
                return await response.json()

    async def send_email(self, to, subject, body):
        data = {
            "to": [{"address": to}],
            "subject": subject,
            "text": body
        }
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{self.base_url}/messages", json=data, headers=self.headers) as response:
                return await response.json()

    async def delete_email(self, email_id):
        async with aiohttp.ClientSession() as session:
            async with session.delete(f"{self.base_url}/messages/{email_id}", headers=self.headers) as response:
                return response.status == 204
