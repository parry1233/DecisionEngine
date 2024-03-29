# Generated by Django 3.2.9 on 2021-11-25 07:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('system', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ScoreCardLibrary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Enter name', max_length=20)),
            ],
        ),
        migrations.RenameField(
            model_name='variablepool',
            old_name='book',
            new_name='fkey',
        ),
        migrations.CreateModel(
            name='ScoreCardPool',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('operator', models.CharField(choices=[('b', '>'), ('e', '='), ('s', '<')], default='e', help_text='Operator', max_length=1)),
                ('weight', models.FloatField(default='1', help_text='Weight')),
                ('value', models.CharField(help_text='Value', max_length=20)),
                ('fkey', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='system.scorecardlibrary')),
                ('parameter', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='system.variablepool')),
            ],
        ),
    ]
