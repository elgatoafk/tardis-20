from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

from dateutil import parser
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

TIMEZONE_FILE = Path("timezones.txt")

PAST_FORMAT = "{d} days, {h} hours, {m} minutes and {s} seconds passed."
FUTURE_FORMAT = "{d} days, {h} hours, {m} minutes and {s} seconds left."


def load_timezones() -> list[str]:
    if not TIMEZONE_FILE.exists():
        return [
            "Europe/Kyiv",
            "UTC",
            "America/New_York",
        ]

    return [
        line.strip()
        for line in TIMEZONE_FILE.read_text(
            encoding="utf-8"
        ).splitlines()
        if line.strip()
    ]


TIMEZONES = load_timezones()


app = FastAPI(
    title="Tardis Remastered Backend",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DifferenceRequest(BaseModel):
    datetime_str: str
    timezone: str


class TimedeltaRequest(BaseModel):
    datetime_str: str
    timedelta_days: int


def parse_input(date_string: str, timezone: str | None = None) -> datetime:
    try:
        dt = parser.parse(date_string)

        if timezone:
            if timezone not in TIMEZONES:
                raise HTTPException(
                    status_code=400,
                    detail="Unsupported timezone."
                )

            dt = dt.replace(
                tzinfo=ZoneInfo(timezone)
            )

        elif dt.tzinfo is None:
            dt = dt.astimezone()

        return dt

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


def pretty_delta(delta: timedelta) -> tuple[str, bool]:
    future = delta.total_seconds() > 0

    seconds = abs(int(delta.total_seconds()))

    days, seconds = divmod(seconds, 86400)
    hours, seconds = divmod(seconds, 3600)
    minutes, seconds = divmod(seconds, 60)

    template = FUTURE_FORMAT if future else PAST_FORMAT

    return (
        template.format(
            d=days,
            h=hours,
            m=minutes,
            s=seconds,
        ),
        future,
    )


@app.get("/")
def health():
    return {
        "status": "ok"
    }


@app.get("/timezones")
def get_timezones():
    return {
        "timezones": TIMEZONES
    }


@app.post("/get-difference")
def get_difference(request: DifferenceRequest):
    user_dt = parse_input(
        request.datetime_str,
        request.timezone,
    )

    now = datetime.now(
        ZoneInfo("UTC")
    )

    result, future = pretty_delta(
        user_dt.astimezone(ZoneInfo("UTC")) - now
    )

    return {
        "result": result,
        "future_warning": future,
        "calculated_from": user_dt.isoformat(),
    }


@app.post("/add-subtract-timedelta")
def add_subtract_timedelta(
    request: TimedeltaRequest,
):
    dt = parse_input(request.datetime_str)

    return {
        "result": (
            dt +
            timedelta(days=request.timedelta_days)
        ).isoformat()
    }
