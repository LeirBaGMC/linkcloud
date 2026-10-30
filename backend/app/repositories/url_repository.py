from app.configuration.dynamodb_client import get_dynamodb_table


def save_url(item: dict[str, str]) -> None:
    table = get_dynamodb_table()
    table.put_item(
        Item=item,
        # Evita reemplazar un enlace existente si se repitiera un UUID.
        ConditionExpression="attribute_not_exists(short_code)",
    )


def find_url(short_code: str) -> dict[str, str] | None:
    table = get_dynamodb_table()
    response = table.get_item(
        Key={"short_code": short_code},
        # Permite consultar el enlace inmediatamente después de crearlo.
        ConsistentRead=True,
    )
    return response.get("Item")
