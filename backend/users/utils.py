from django.core.mail import send_mail


def send_activation_email(email, code):
    activation_link = f"myapp://verify-email?code={code.code}"
    send_mail(
        "Aktywuj swoje konto",
        f"Skopiuj kod {code.code}, albo kliknij w link, aby aktywować swoje konto: {activation_link}",
        "from@example.com",
        [email or "no-reply@example.com"],
    )
