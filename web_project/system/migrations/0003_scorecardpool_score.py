# Generated by Django 3.2.9 on 2021-11-29 11:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('system', '0002_auto_20211125_0752'),
    ]

    operations = [
        migrations.AddField(
            model_name='scorecardpool',
            name='score',
            field=models.FloatField(default='1', help_text='Score'),
        ),
    ]
