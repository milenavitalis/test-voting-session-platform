from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy import Enum
import enum

class SessionStatusEnum(str, enum.Enum):
    pending = "pending"
    open = "open"
    close = "close"

class Topic(Base):
    __tablename__ = "topics"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    sessions = relationship("Session", back_populates="topic", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="topic", cascade="all, delete-orphan")


class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    duration_minutes = Column(Integer, default=1)
    status = Column(Enum(SessionStatusEnum, name="sessionstatusenum"), nullable=False)

    topic = relationship("Topic", back_populates="sessions")
    votes = relationship("Vote", back_populates="session", cascade="all, delete-orphan")


class Vote(Base):
    __tablename__ = "votes"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vote = Column(String, nullable=False)  # "Sim" ou "Não"
    
    session = relationship("Session", back_populates="votes")
    topic = relationship("Topic", back_populates="votes")
    user = relationship("User")