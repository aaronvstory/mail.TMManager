from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .database import SessionLocal, engine
from .mail_tm_client import MailTmClient
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import List

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = crud.get_user(db, username=username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.post("/email/create/")
async def create_email(email: schemas.EmailCreate, current_user: models.User = Depends(get_current_user)):
    mail_tm_client = MailTmClient(current_user.mail_tm_token)
    return await mail_tm_client.create_email(email.address)

@app.get("/emails/{folder}", response_model=List[schemas.Email])
async def get_emails(folder: str, current_user: models.User = Depends(get_current_user)):
    mail_tm_client = MailTmClient(current_user.mail_tm_token)
    return await mail_tm_client.get_emails(folder)

@app.get("/emails/{email_id}", response_model=schemas.Email)
async def get_email(email_id: str, current_user: models.User = Depends(get_current_user)):
    mail_tm_client = MailTmClient(current_user.mail_tm_token)
    return await mail_tm_client.get_email(email_id)

@app.post("/email/send/")
async def send_email(email: schemas.EmailSend, current_user: models.User = Depends(get_current_user)):
    mail_tm_client = MailTmClient(current_user.mail_tm_token)
    return await mail_tm_client.send_email(email.to, email.subject, email.body)

@app.delete("/emails/{email_id}")
async def delete_email(email_id: str, current_user: models.User = Depends(get_current_user)):
    mail_tm_client = MailTmClient(current_user.mail_tm_token)
    return await mail_tm_client.delete_email(email_id)
