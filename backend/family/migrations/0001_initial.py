# Generated by Django 5.1.2 on 2025-01-12 03:24

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Family',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owned_families', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Family',
                'verbose_name_plural': 'Families',
                'indexes': [models.Index(fields=['created_at'], name='family_fami_created_013052_idx')],
            },
        ),
    ]
