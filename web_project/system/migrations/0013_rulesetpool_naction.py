# Generated by Django 3.2.9 on 2022-01-30 13:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('system', '0012_rulesetlibrary_rulesetpool'),
    ]

    operations = [
        migrations.AddField(
            model_name='rulesetpool',
            name='naction',
            field=models.TextField(help_text='nAction', null=True),
        ),
    ]
