from .user import User
from sqlalchemy.orm import declarative_base
from app.models import user, topic

Base = declarative_base()