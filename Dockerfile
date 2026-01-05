FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
PYTHONBUFFERED=1

RUN useradd -m appuser
WORKDIR /app

COPY RubikTimer/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY RubikTimer/ .
USER appuser

EXPOSE 8000

CMD ["guicorn", "--bind", "0.0.0.0:8000", "RubikTimer.wsgi:application"]