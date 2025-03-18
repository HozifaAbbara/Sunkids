from rest_framework.response import Response
from rest_framework.views import APIView
from django.apps import apps

TRANSLATION = [
    {"name": "username", "label": "اسم المستخدم"},
    {"name": "first_name", "label": "الاسم الاول"},
    {"name": "last_name", "label": "الاسم الاخير"},
]


class TableColumnsView(APIView):
    def get(self, request, app_name, model_name):
        try:
            # Dynamically get the model
            model = apps.get_model(app_name, model_name)

            # Get field names and labels
            columns = []
            for field in model._meta.fields:
                field_name = field.name
                field_label = field.verbose_name

                # Handle nested Account fields (for Employee, Parent)
                if field_name == "account":
                    account_model = apps.get_model(app_name, "Account")
                    for TR in TRANSLATION:
                        columns.append(TR)
                else:
                    columns.append({
                        "name": field_name,
                        "label": field_label
                    })

            return Response({"columns": columns})
        
        except LookupError:
            return Response({"error": "Model not found"}, status=400)
