# Generated by Django 3.2.9 on 2022-01-31 06:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('system', '0013_rulesetpool_naction'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rulesetpool',
            name='action',
            field=models.TextField(blank=True, help_text='Action', null=True),
        ),
        migrations.AlterField(
            model_name='rulesetpool',
            name='naction',
            field=models.TextField(blank=True, help_text='nAction', null=True),
        ),
    ]
