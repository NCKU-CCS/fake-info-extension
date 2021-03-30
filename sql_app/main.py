# body
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import databases, sqlalchemy
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String ,DateTime ,Boolean
from pydantic import BaseModel, Field
from typing import List, Optional


# other
import datetime, random, uuid


# enable CORS
origins = [
    # "http://localhost",
    # "http://localhost:5500",
    # "http://127.0.0.1:5500",
    # "https://udn.com/*"
    "*"
]



#connnect to database
DATABASE_URL = 'postgresql://kjyang:netdb2602@localhost:5432/news_postgres'
database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()


#define table
users = sqlalchemy.Table(
    'result',
    metadata,
    sqlalchemy.Column('user_id' ,String , primary_key = True ),
    sqlalchemy.Column('news_url',String ,  primary_key = True ),
    sqlalchemy.Column('create_at',DateTime ,default=datetime.datetime.utcnow ),
    sqlalchemy.Column('news_result',Boolean ),
    sqlalchemy.Column('block_chain_url',String  ),
)

engine = create_engine(
    DATABASE_URL
)
metadata.create_all(engine)

# Model
class UserList(BaseModel):
    user_id          : str
    news_url         : str
    create_at        : Optional[datetime.datetime] = None
    news_result      : bool
    # block_chain_url  : str  # recover this when block chain is complete

class UserListGetid(BaseModel):
    user_id          : str
    news_url         : str


class UserEntry(BaseModel):
    user_id          : str  
    news_url         : str  
    news_result      : bool


class UserUpdate(BaseModel):
    user_id          : str = Field(..., example = 'enter your id')
    news_url         : str  = Field(..., example = 'enter your url')
    create_at        : Optional[datetime.datetime] = None
    news_result      : bool = Field(..., example = False)
    block_chain_url  : str  = Field(..., example = '321321314')

class UserDelete(BaseModel):
    user_id          : str = Field(..., example = 'enter your id')
    news_url         : str = Field(..., example = 'enter your url')


# fastapi
app = FastAPI() 

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event('startup')
async def startup():
    await database.connect()

@app.on_event('shutdown')
async def shutdown():
    await database.disconnect()

@app.get('/users', response_model = List[UserList])
async def find_all_user():
    query = users.select()
    return await database.fetch_all(query)

@app.post('/users/{user_id}/{news_url}/{news_result}', response_model = UserEntry)
async def register_user(user : UserEntry):
    gDate = datetime.datetime.now()
    query = users.insert().values(
        user_id = user.user_id,
        news_url = user.news_url,
        create_at = gDate,
        news_result = user.news_result
    )

    await database.execute(query)
    return {
        'user_id'          : user.user_id,
        'news_url'         : user.news_url,
        'news_result'      : user.news_result,
     }

@app.get('/users/{user_id}/{news_url}', response_model = UserListGetid)
async def find_user_by_id(user_id : str, news_url : str):
    query = users.select().where(users.c.user_id == user_id ).where( users.c.news_url == news_url )
    return await database.fetch_one(query)

@app.put('/users', response_model = UserList)
async def update_user(user : UserUpdate):
    gDate = datetime.datetime.now()
    query = users.update().\
        where(users.c.user_id == user.user_id and users.c.news_url == user.news_url).\
        values(
            create_at = gDate,
            news_result = user.news_result,
            block_chain_url = user.block_chain_url
        )
    await database.execute(query)

    return await find_user_by_id(user_id= user.user_id,news_url =  user.news_url)

@app.delete('/users/{user_id}/{news_url}')
async def delete_user(user: UserDelete):
    query = users.delete().where(users.c.user_id == user.user_id ).where( users.c.news_url == user.news_url )
    await database.execute(query)

    return {
        'message': 'This user has been deleted successfully'
    }