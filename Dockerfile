FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
PYTHONBUFFERED=1

RUN useradd -m appuser

WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY RubikTimer/requirements.txt .
RUN uv pip install -r requirements.txt --system

COPY RubikTimer/ .

EXPOSE 8000

CMD ["guicorn", "--bind", "0.0.0.0:8000", "RubikTimer.wsgi:application"]