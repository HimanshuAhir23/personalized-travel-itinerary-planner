"""Supabase client initialization and management."""

import logging
from typing import Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

_supabase_client = None
_admin_client = None


class InMemorySupabaseMock:
    """An in-memory mock implementation used for local development/testing

    when Supabase credentials are not configured or external service is unreachable.
    """

    def __init__(self):
        self._tables: dict[str, list[dict[str, Any]]] = {
            "trips": [],
            "itineraries": [],
            "shares": [],
        }
        self.auth = MockAuth()

    def table(self, table_name: str) -> "MockQueryBuilder":
        if table_name not in self._tables:
            self._tables[table_name] = []
        return MockQueryBuilder(self._tables[table_name])


class MockAuth:
    """Mock auth service for testing/offline mode."""

    def __init__(self):
        self.users: dict[str, dict[str, Any]] = {}

    def sign_up(self, credentials: dict[str, Any]) -> Any:
        email = credentials.get("email")
        user_id = f"mock-user-{abs(hash(email)) % 100000}"
        user_data = {
            "id": user_id,
            "email": email,
            "user_metadata": credentials.get("options", {}).get("data", {}),
            "created_at": "2026-01-01T00:00:00Z",
        }
        self.users[user_id] = user_data

        class AuthResponse:
            user = type("UserObj", (), user_data)()
            session = type(
                "SessionObj",
                (),
                {"access_token": f"mock-jwt-{user_id}", "token_type": "bearer"},
            )()

        return AuthResponse()

    def sign_in_with_password(self, credentials: dict[str, Any]) -> Any:
        email = credentials.get("email")
        user_id = f"mock-user-{abs(hash(email)) % 100000}"
        user_data = {
            "id": user_id,
            "email": email,
            "user_metadata": {},
            "created_at": "2026-01-01T00:00:00Z",
        }
        self.users[user_id] = user_data

        class AuthResponse:
            user = type("UserObj", (), user_data)()
            session = type(
                "SessionObj",
                (),
                {"access_token": f"mock-jwt-{user_id}", "token_type": "bearer"},
            )()

        return AuthResponse()

    def get_user(self, jwt: str) -> Any:
        # Extract user_id from token if format is mock-jwt-<id>
        if jwt.startswith("mock-jwt-"):
            user_id = jwt[len("mock-jwt-"):]
            user_data = self.users.get(
                user_id,
                {"id": user_id, "email": f"{user_id}@example.com", "user_metadata": {}},
            )
        else:
            user_data = {
                "id": "mock-user-123",
                "email": "traveler@example.com",
                "user_metadata": {"full_name": "Test Traveler"},
            }

        class UserWrapper:
            user = type("UserObj", (), user_data)()

        return UserWrapper()


class MockQueryBuilder:
    """Mock query builder simulating PostgREST table queries."""

    def __init__(self, data_store: list[dict[str, Any]]):
        self.data_store = data_store
        self._action = "select"
        self._insert_data = None
        self._update_data = None
        self._filters: list[tuple[str, str, Any]] = []
        self._single = False

    def select(self, columns: str = "*") -> "MockQueryBuilder":
        self._action = "select"
        return self

    def insert(self, values: Any) -> "MockQueryBuilder":
        self._action = "insert"
        self._insert_data = values
        return self

    def update(self, values: dict[str, Any]) -> "MockQueryBuilder":
        self._action = "update"
        self._update_data = values
        return self

    def delete(self) -> "MockQueryBuilder":
        self._action = "delete"
        return self

    def eq(self, column: str, value: Any) -> "MockQueryBuilder":
        self._filters.append(("eq", column, value))
        return self

    def order(self, column: str, desc: bool = False) -> "MockQueryBuilder":
        return self

    def single(self) -> "MockQueryBuilder":
        self._single = True
        return self

    def execute(self) -> Any:
        class QueryResponse:
            def __init__(self, data: Any):
                self.data = data

        if self._action == "insert":
            inserted = []
            records = self._insert_data if isinstance(self._insert_data, list) else [self._insert_data]
            for r in records:
                row = dict(r)
                self.data_store.append(row)
                inserted.append(row)
            return QueryResponse(inserted[0] if self._single and inserted else inserted)

        matched_indices = []
        for idx, row in enumerate(self.data_store):
            match = True
            for op, col, val in self._filters:
                if op == "eq" and str(row.get(col)) != str(val):
                    match = False
                    break
            if match:
                matched_indices.append(idx)

        if self._action == "select":
            matched_rows = [self.data_store[i] for i in matched_indices]
            if self._single:
                return QueryResponse(matched_rows[0] if matched_rows else None)
            return QueryResponse(matched_rows)

        if self._action == "update":
            updated_rows = []
            for idx in matched_indices:
                self.data_store[idx].update(self._update_data)
                updated_rows.append(self.data_store[idx])
            if self._single:
                return QueryResponse(updated_rows[0] if updated_rows else None)
            return QueryResponse(updated_rows)

        if self._action == "delete":
            deleted_rows = []
            for idx in sorted(matched_indices, reverse=True):
                deleted_rows.append(self.data_store.pop(idx))
            return QueryResponse(deleted_rows)

        return QueryResponse([])


def get_supabase_client() -> Any:
    """Get standard Supabase client (anon key). Fallbacks to in-memory mock if invalid."""
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY and not settings.SUPABASE_URL.startswith("https://dummy"):
        try:
            from supabase import create_client
            _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
            return _supabase_client
        except Exception as e:
            logger.warning("Could not initialize Supabase client: %s. Using in-memory store.", e)

    _supabase_client = InMemorySupabaseMock()
    return _supabase_client


def get_admin_client() -> Any:
    """Get Supabase service role client. Fallbacks to in-memory mock if invalid."""
    global _admin_client
    if _admin_client is not None:
        return _admin_client

    key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
    if settings.SUPABASE_URL and key and not settings.SUPABASE_URL.startswith("https://dummy"):
        try:
            from supabase import create_client
            _admin_client = create_client(settings.SUPABASE_URL, key)
            return _admin_client
        except Exception as e:
            logger.warning("Could not initialize Supabase admin client: %s. Using in-memory store.", e)

    _admin_client = InMemorySupabaseMock()
    return _admin_client
